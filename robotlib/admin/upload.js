module.exports = function(message, speratedSection){

    //post
    if(speratedSection[2] === fn.mstr.post['name']){
        console.log('post upload');
        fn.m.post.upload.routting(message, speratedSection);
    }

}