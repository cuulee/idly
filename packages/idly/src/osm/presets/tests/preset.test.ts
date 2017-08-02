/* globals context: true */
import { wayFactory } from 'osm/entities/way';
import { tagsFactory } from 'osm/entities/helpers/tags';
import { presetField } from 'osm/presets/field';
import { presetPreset } from 'osm/presets/preset';
import { initAreaKeys, initPresets } from 'osm/presets/presets';

describe('presetPreset', function() {
  it('has optional fields', function() {
    const preset = presetPreset('test', {});
    expect(preset.fields).toEqual([]);
  });

  describe('#matchGeometry', function() {
    it("returns false if it doesn't match", function() {
      const preset = presetPreset('test', { geometry: ['line'] });
      expect(preset.matchGeometry('point')).toBe(false);
    });

    it('returns true if it does match', function() {
      const preset = presetPreset('test', { geometry: ['point', 'line'] });
      expect(preset.matchGeometry('point')).toBe(true);
    });
  });

  describe('#matchScore', function() {
    const way1 = wayFactory({
      id: 'w-1',
      tags: tagsFactory({ highway: 'motorway' })
    });
    it('returns -1 if preset does not match tags', function() {
      const preset = presetPreset('test', { tags: { foo: 'bar' } });
      expect(preset.matchScore(way1)).toBe(-1);
    });

    it('returns the value of the matchScore property when matched', function() {
      const preset = presetPreset('test', {
        tags: { highway: 'motorway' },
        matchScore: 0.2
      });
      const entity = wayFactory(way1);
      expect(preset.matchScore(entity)).toBe(0.2);
    });

    it('defaults to the number of matched tags', function() {
      let preset = presetPreset('test', {
        tags: { highway: 'residential' }
      });
      let entity = wayFactory({
        id: 'w-2',
        tags: tagsFactory({ highway: 'residential' })
      });
      expect(preset.matchScore(entity)).toBe(1);

      preset = presetPreset('test', {
        tags: { highway: 'service', service: 'alley' }
      });
      entity = wayFactory({
        id: 'w-3',
        tags: tagsFactory({ highway: 'service', service: 'alley' })
      });
      expect(preset.matchScore(entity)).toBe(2);
    });

    it('counts * as a match for any value with score 0.5', function() {
      const preset = presetPreset('test', { tags: { building: '*' } });
      const entity = wayFactory({
        id: 'w-3',
        tags: tagsFactory({ building: 'yep' })
      });
      expect(preset.matchScore(entity)).toBe(0.5);
    });
  });

  describe('isFallback', function() {
    it('returns true if preset has no tags', function() {
      const preset = presetPreset('point', { tags: {} });
      expect(preset.isFallback()).toBe(true);
    });

    it("returns true if preset has a single 'area' tag", function() {
      const preset = presetPreset('area', { tags: { area: 'yes' } });
      expect(preset.isFallback()).toBe(true);
    });

    it("returns false if preset has a single non-'area' tag", function() {
      const preset = presetPreset('building', { tags: { building: 'yes' } });
      expect(preset.isFallback()).toBe(false);
    });

    it('returns false if preset has multiple tags', function() {
      const preset = presetPreset('building', {
        tags: { area: 'yes', building: 'yes' }
      });
      expect(preset.isFallback()).toBe(false);
    });
  });

  describe('#applyTags', function() {
    const { collection } = initPresets();
    const areaKeys = initAreaKeys(collection);
    it('adds match tags', function() {
      const preset = presetPreset('test', {
        tags: { highway: 'residential' }
      });
      expect(preset.applyTags({}, 'line', areaKeys)).toEqual({
        highway: 'residential'
      });
    });

    it("adds wildcard tags with value 'yes'", function() {
      const preset = presetPreset('test', { tags: { building: '*' } });
      expect(preset.applyTags({}, 'area', areaKeys)).toEqual({
        building: 'yes'
      });
    });

    it('prefers to add tags of addTags property', function() {
      const preset = presetPreset('test', {
        tags: { building: '*' },
        addTags: { building: 'ok' }
      });
      expect(preset.applyTags({}, 'area', areaKeys)).toEqual({
        building: 'ok'
      });
    });

    it('adds default tags of fields with matching geometry', function() {
      const field = presetField('field', {
        key: 'building',
        geometry: 'area',
        default: 'yes'
      });
      const preset = presetPreset('test', { fields: ['field'] }, { field });
      expect(preset.applyTags({}, 'area', areaKeys)).toEqual({
        area: 'yes',
        building: 'yes'
      });
    });

    it('adds no default tags of fields with non-matching geometry', function() {
      const field = presetField('field', {
        key: 'building',
        geometry: 'area',
        default: 'yes'
      });
      const preset = presetPreset('test', { fields: ['field'] }, { field });
      expect(preset.applyTags({}, 'point', areaKeys)).toEqual({});
    });

    describe('for a preset with no tag in areaKeys', function() {
      const preset = presetPreset('test', {
        geometry: ['line', 'area'],
        tags: { name: 'testname', highway: 'pedestrian' }
      });

      it("doesn't add area=yes to non-areas", function() {
        expect(preset.applyTags({}, 'line', areaKeys)).toEqual({
          name: 'testname',
          highway: 'pedestrian'
        });
      });

      it('adds area=yes to areas', function() {
        expect(preset.applyTags({}, 'area', areaKeys)).toEqual({
          name: 'testname',
          highway: 'pedestrian',
          area: 'yes'
        });
      });
    });

    describe('for a preset with a tag in areaKeys', function() {
      const preset = presetPreset('test', {
        geometry: ['area'],
        tags: { name: 'testname', natural: 'water' }
      });
      it("doesn't add area=yes", function() {
        expect(preset.applyTags({}, 'area', areaKeys)).toEqual({
          name: 'testname',
          natural: 'water'
        });
      });
    });
  });

  describe('#removeTags', function() {
    it('removes tags that match preset tags', function() {
      const preset = presetPreset('test', {
        tags: { highway: 'residential' }
      });
      expect(preset.removeTags({ highway: 'residential' }, 'area')).toEqual({});
    });

    it('removes tags that match field default tags', function() {
      const field = presetField('field', {
        key: 'building',
        geometry: 'area',
        default: 'yes'
      });
      const preset = presetPreset('test', { fields: ['field'] }, { field });
      expect(preset.removeTags({ building: 'yes' }, 'area')).toEqual({});
    });

    it('removes area=yes', function() {
      const preset = presetPreset('test', { tags: { highway: 'pedestrian' } });
      expect(
        preset.removeTags({ highway: 'pedestrian', area: 'yes' }, 'area')
      ).toEqual({});
    });

    it('preserves tags that do not match field default tags', function() {
      const field = presetField('field', {
        key: 'building',
        geometry: 'area',
        default: 'yes'
      });
      const preset = presetPreset('test', { fields: ['field'] }, { field });
      expect(preset.removeTags({ building: 'yep' }, 'area')).toEqual({
        building: 'yep'
      });
    });

    it('preserves tags that are not listed in removeTags', function() {
      const preset = presetPreset('test', {
        tags: { a: 'b' },
        removeTags: {}
      });
      expect(preset.removeTags({ a: 'b' }, 'area')).toEqual({ a: 'b' });
    });
  });
});
