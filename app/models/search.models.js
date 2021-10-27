const db = require('../common/connect');

const Search = function (search) {
    this.id_search = search.id;

}

Search.search_infor =(keyword, result) => {

    db.query('SELECT content_post FROM tbl_post WHERE content_post LIKE "%'+keyword+'%"',function(err, rows, fields) {
        if (err) throw err;
        var data=[];
       // console.log(rows);
       // console.log(fields);
        for(i=0;i<rows.length;i++)
        {
           // console.log(rows[i].content_post);
            data.push(rows[i].content_post);
        }
      //  res.send(JSON.stringify(data));
      result(null,data );
    });

}

Search.searchContent_post = (content_post, result) =>{
    db.query('SELECT * FROM tbl_post WHERE content_post = ?',content_post, (err, res) =>{
        if (err){
            console.log('Error check content_post', err);
            result(err,null);
        }else {
            console.log('Check content_post successfully');
            result(null, res);
        }
    })
}
module.exports = Search;