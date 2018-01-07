import * as React from 'react';
import { Tags } from 'idly-common/lib/osm/structures';
export function FieldLanes({ field, tags }: { field: any; tags: Tags }) {
  return (
    <div>
      <div>FieldLanes: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
