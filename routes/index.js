
/*
 * GET home page.
 */
 
const cheerio = require('cheerio');
const request = require('request');
var books = [{
  id: 1,
  owner: 1,
  name: 'JavaScript:The Definitive Guide,Sixth Edition',
  pic: 'data:image/jpg;base64,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',
  hasDelete: false
}];
var records = []; 
exports.index = function(req, res){
  res.render('index', { title: '三味书屋', message: req.flash('info'), user: req.user});
};

exports.all = function(req, res){
  var result = books;
  var userId = req.user.id;
  for (var i=0;i<result.length;i++) {
    result[i].canBorrow = true;
    if (result[i].owner == userId) {
      result[i].canBorrow = false;
    }
    for (var j=0;j<records.length;j++) {
      if (result[i].id == records[j].book && records[j].backDate == null) {
        result[i].canBorrow = false;
      }
    } 
  }
  var youBorrows = youBorrow(userId);
  var myBooks = myBook(userId);
  var borrowYous = borrowYou(userId, myBooks);
  res.render('all', { title: '所有图书', user: req.user, books: result.filter(function(val) {return !val.hasDelete;}), message: req.flash('info'),youBorrows:youBorrows, borrowYous:borrowYous });
};

exports.my = function(req, res){
  var userId = req.user.id;
  var youBorrows = youBorrow(userId);
  var myBooks = myBook(userId);
  var borrowYous = borrowYou(userId, myBooks);
  res.render('my', { title: '我的图书', user: req.user, books: myBooks, message: req.flash('info'), youBorrows:youBorrows, borrowYous:borrowYous });
};

exports.add = function(req, res){
    var book =req.body.book;
    request('https://www.google.co.uk/search?tbm=bks&q='+book, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body);
        var item = $('.g').first();
        books.push({
          id: books.length+1,
          name: item.find('.r').find('a').text(),
          pic: item.find('img.th').attr('src'),
          owner: req.user.id,
          hasDelete: false 
        });
        req.flash('info', '添加成功');
        res.redirect('/my');
      } else {
        res.json(error)
      }
    });
};

exports.borrow = function(req, res) {
  var book = req.params.book;
  var userId = req.user.id;
  records.push({
    id:records.length+1,
    book:book,
    userId: userId,
    borrowDate: new Date(),
    backDate:null
  });
  req.flash('info', '借书成功');
  res.redirect('/all');
};

exports.delete = function(req, res) {
  var book = req.params.book;
  for (var i=0;i<records.length;i++) {
    if (records[i].book == book && records[i].back == null ) {
      req.flash('info', '图书外借中，不能删除');
      return res.redirect('/my');
    }
  }
  for (var i=0;i<books.length;i++) {
    if (books[i].id == book) {
      books[i].hasDelete = true;
      break;
    }
  }
  req.flash('info', '删除成功');
  res.redirect('/my');
};

exports.back = function(req, res) {
  var book = req.params.book;
  var userId = req.user.id;
  for (var i=0;i<records.length;i++) {
    if (records[i].book == book && records[i].userId == userId && records[i].backDate == null) {
      records[i].backDate = new Date();
      break;
    }
  }
  req.flash('info', '归还成功');
  res.redirect('/my');
};

exports.setting = function(req, res){
  res.render('setting', { title: '设置', user: req.user, message: req.flash('info') });
};

function youBorrow(userId) {
  var result = [];
  for (var i=0;i<records.length;i++) {
    if (records[i].userId == userId) {
      for (var j=0;j<books.length;j++) {
        if (records[i].book == books[j].id) {
          result.push({
            id: books[j].id,
            name: books[j].name,
            whetherBack: records[i].backDate!=null
          });
        }
      }
    }
  }
  return result;
}

function myBook(userId) {
  var result = [];
  for (var i=0;i<books.length;i++) {
    if (books[i].owner == userId && !books[i].hasDelete) {
      result.push(books[i]);
    }
  }
  return result;
}

function borrowYou(userId, myBooks) {
  var result = [];
  for (var i=0;i<myBooks.length;i++) {
    for (var j=0;j<records.length;j++) {
      if (records[j].book == myBooks[i].id) {
        result.push({
          name: myBooks[j].name,
          whetherBack: records[i].backDate != null
        });
      }
    }
  }
  return result;
}
