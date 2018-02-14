import db from '../database/database';

export default {
  getRecords,
  getRecordById,
  addRecord,
  updateRecord,
  removeRecord,
  getRecordsByCategoryId,
};

async function getRecords(userId, searchQuery) {
  const Record = db.models.Record;

  const query: any = {
    userId,
  };

  const sort = {};

  sort[searchQuery.sortBy] = 1;

  const records = await Record.find(query).sort(sort);

  return records.map((record) => {
    return mapRecord(record);
  });
}

async function getRecordById(id) {
  const Record = db.models.Record;

  const record = await Record.findById(id);

  return mapRecord(record);
}

async function addRecord(userId, recordData) {
  const Record = db.models.Record;

  recordData.userId = userId;

  const record = await Record.create(recordData);

  return mapRecord(record);
}

async function updateRecord(recordData) {
  const Record = db.models.Record;

  const record = await Record.findOne({_id: recordData.id});

  if (!record) { return; }

  record.date = recordData.date;
  record.cost = recordData.cost;
  record.categoryId = recordData.categoryId;
  record.note = recordData.note;

  const result = await record.save();

  return mapRecord(result);
}

async function removeRecord(id) {
  const Record = db.models.Record;

  return await Record.remove({_id: id});
}

async function getRecordsByCategoryId(categoryId) {
  const Record = db.models.Record;

  const records = await Record.find({categoryId});

  return records.map((record) => {
    return mapRecord(record);
  });
}

// helper methods

function mapRecord(record) {
  record._doc.id = record._id;

  return record;
}
