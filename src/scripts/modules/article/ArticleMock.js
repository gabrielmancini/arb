angular.module('arb.modules.article.ArticleMock', 
  ['arb.common.resources.ArbRestMock'])

.run(['$httpBackend', '$timeout', '$log', 'conf', 'sessionStorage',
  function ($httpBackend, $timeout, $log, conf, sessionStorage) {

    console.log('ArticleMock Called')

    var baseUrl = conf.getApiUrl();
    var authorized = sessionStorage.get('authenticated');
    var getIdFromResource = function (resource, url) {
      return url.split('/').pop().replace(resource, '');
    };
    /**
     * Article API
     */

    // /article
    // /article/
    // /article/[a-z0-9]
    $httpBackend.when('GET', new RegExp(baseUrl + '/article(\/\w+)?'))
      .respond(function (method, url, data, headers) {
        var id = ArbRestMock.getIdFromResource('article', url);
        var articles = JSON.parse(sessionStorage.get('articles')) || [];
        var result = id ? articles[id-1] : articles;

        $log.info(method, baseUrl + '/article');

        if (!authorized) {
          return [401, { error: 'You are not logged in.' }];
        } else {
          return [200, result];
        }
      });

    $httpBackend.when('POST', baseUrl + '/article')
      .respond(function (method, url, data) {
        console.log('-----------FUUUUUUUUUCK---------')
        var articles = JSON.parse(sessionStorage.get('articles')) || [];
        var parsedData = JSON.parse(data);

        var newArticle = {
          _id: articles.length + 1,
          title: parsedData.title,
          content: parsedData.content,
          created: new Date()
        };

        $log.info(method, baseUrl + '/article');

        if (!authorized) {
          return [401, { error: 'You are not logged in.' }];
        } else {
          articles.push(newArticle);
          sessionStorage.set('articles', JSON.stringify(articles));
          return [200, newArticle];
        }
      });

  }
]);
