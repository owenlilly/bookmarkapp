import mongoose, { Schema } from 'mongoose';
import BaseRepository from "./BaseRepository";

const bookmarkSchema = new Schema({
  owner: Schema.Types.ObjectId,
  title: String,
  description: String,
  link: String
}, { timestamps: {} });

export const BookmarkModel = mongoose.model('Bookmark', bookmarkSchema);

export default class BookmarkRepository extends BaseRepository {
  constructor(){
    super(BookmarkModel);
  }

  save(bookmark){
    bookmark.owner = this.asObjectId(bookmark.owner);
    return super.save(bookmark);
  }
}