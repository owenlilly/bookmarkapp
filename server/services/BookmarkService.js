import BookmarkRepository from '../repositories/BookmarkRepository';
import Rx from 'rxjs';

const bookmarkRepo = new BookmarkRepository();

export default class BookmarkService {

  save(bookmark){
    const errors = this.validate(bookmark);

    if(errors){
      return Rx.Observable.throw(new Error(errors));
    }

    return bookmarkRepo.save(bookmark);
  }

  remove(id){
    id = bookmarkRepo.asObjectId(id);
    return bookmarkRepo.remove({_id: id});
  }

  listAll(){
    return bookmarkRepo.find({});
  }

  validate(bookmark){
    const errors = [];
    
    if(!bookmark.link || bookmark.link.trim() === ''){
      errors.push('link required');
    }

    if(!bookmark.title || bookmark.title.trim() === ''){
      errors.push('title required');
    }

    if(!bookmark.owner){
      errors.push('owner required');
    }

    return errors.length > 0 ? errors.join(', ') : undefined;
  }
}