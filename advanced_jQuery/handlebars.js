var post = {
  title: 'Lorem ipsum dolor sit amet',
  published: 'April 1, 2015',
  body: '<p>Sed ut <strong>perspiciatis</strong> unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>',
  tags: ['lorem', 'ipsum', 'omnis'],
};

var postTemplate = Handlebars.compile($('#posts').html());
Handlebars.registerPartial('tag', $('#tag').html());
//$('body').append(postTemplate(post));

var post2 = {
  title: 'Post 2: Lorem ipsum dolor sit amet',
  published: 'April 2, 2015',
  body: '<p>Sed ut <em>perspiciatis</em> unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>',
};
var posts = [post, post2];
$('body').append(postTemplate({posts: posts}));


