//The tests
describe('<Unit Test> ArticleCtrl', function() {

  beforeEach(module('arb'));

  describe('Internal methods', function() {

    var $scope, ArticleCtrl;

    beforeEach(
      inject(function ($controller, $rootScope, $state, ArbRest ) {
        $scope = $rootScope.$new();
        ArticleCtrl = $controller('ArticleCtrl', {
          $scope: $scope,
          ArbRest: ArbRest
        });
        
        $state.transitionTo('article');
      })
    );

    afterEach(
      inject(function ($rootScope) {
        $rootScope.$digest();
      })
    );

    it( 'should pass a dummy test ArticleCtrl', function() {
      ArticleCtrl.should.exist;
    });

    describe('Server Methods', function() {

      beforeEach(
        inject(function ($httpBackend, conf) {
          var baseUrl = conf.getApiUrl();
          $httpBackend.expectPOST( baseUrl + '/article').respond();
        })
      );

      afterEach(
        inject(function ($httpBackend) {
          $httpBackend.flush();
        })
      );

      iit('should be able to save without problems', 
        inject(function ($rootScope, $state, conf) {
          $state.transitionTo('article.create');

          $scope.title = 'title of article';
          $scope.contents = 'contents of article';

          ArticleCtrl.create($state, $scope);
        })
      );

      it('should be able to show an error when try to save without title', 
        inject(function ($rootScope, $state, conf) {
          $state.transitionTo('article.create');

          $scope.title = undefined;
          $scope.contents = 'contents of article';

          ArticleCtrl.create($state, $scope);
        })
      );

    });

  });

});