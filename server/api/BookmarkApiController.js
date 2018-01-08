import BookmarkService from "../services/BookmarkService";


export default function BookmarkApiController(app) {
  const bookmarkService = new BookmarkService();
  
  app.delete('/api/bookmarks/:id', (req, res) => {
    if(!req.user){
      res.status(401).json({ error: 'Login required' });
      return;
    }

    bookmarkService.remove(req.params.id).subscribe(b => {
      res.json(b);
    }, err => {
      res.status(500).json({ error: err.message });
    });
  });

  app.post('/api/bookmarks', (req, res) => {
    if(!req.user){
      res.status(401).json({ error: 'Login required' });
      return;
    }

    const bookmark = req.body;
    bookmark.owner = req.user.id;
    bookmarkService.save(bookmark).subscribe(b => {
      res.json(b);
    }, err => {
      res.status(500).json({error: err.message});
    });
  });

  // get all bookmarks
  app.get('/api/bookmarks', (req, res) => {
    if(!req.user){
      res.status(401).json({ error: 'Login required' });
      return;
    }

    bookmarkService.listAll().subscribe(bookmarks => {
      res.json(bookmarks);
    }, err => {
      res.status(500).json({ error: err.message });
    });
  });
}