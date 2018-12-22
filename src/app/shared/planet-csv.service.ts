import { Injectable } from '@angular/core';
import { Parser } from 'json2csv';

@Injectable()
export class CSVService {

  private data: any;
  private columns: string[];

  constructor(
    private jsonParser: Parser
  ){ }
  
  toCSV(data, fields) {
    console.log(this.jsonParser.parse(data, {fields: fields, flatten: true, flattenSeparator: ";"}));
  }

  setData(data) {
    this.data = data;
  }

  setFields(fields) {
    this.columns = fields;
  }

}
