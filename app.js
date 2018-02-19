var app = angular.module('lookup', []);

app.controller('AppCtrl', function ($scope, $http) {
    $scope.search = function () {
        if($scope.orgname.length >= 3) {
            var url = "http://data.brreg.no/enhetsregisteret/enhet.json";
            var params = {
                page: $scope.page,
                size: 10,
                $filter: "startswith(navn,'" + $scope.orgname + "')"
            };

            $http.get(url, {params: params}, {})
                .then(function (response) {
                    $scope.clearLookup();
                    $scope.search_result = response.data;
                    $scope.page = params.page;
                })
        } else {
            $scope.clearSearch();
        }
    };
    
    $scope.clearSearch = function () {
        $scope.search_result = null;
    }

    $scope.lookup = function (num) {
        if(num > 0) {
            var url = "http://data.brreg.no/enhetsregisteret/enhet/" + num + ".json";

            $http.get(url, {}, {})
                .then(function (response) {
                    $scope.org_data = response.data;
                });
        }
    };

    $scope.clearLookup = function () {
        $scope.orgnum = "";
        $scope.org_data = null;
    };

    $scope.prev = function() {
        if(url = prevUrl($scope.search_result.links)) {
            $http.get(url, {}, {})
                .then(function (response) {
                    $scope.page--;
                    $scope.search_result = response.data;
                });
        }
    };

    $scope.next = function() {
        if(url = nextUrl($scope.search_result.links)) {
            $http.get(url, {}, {})
                .then(function (response) {
                    $scope.page++;
                    $scope.search_result = response.data;
                });
        }
    };

    $scope.hasPrev = function () {
        return prevUrl($scope.search_result.links) != null;
    };

    $scope.hasNext = function () {
        return nextUrl($scope.search_result.links) != null;
    };
});

function prevUrl(data) {
    for(var i in data) {
        if(data[i].rel == "prev")
            return data[i].href;
    }
    return null;
}

function nextUrl(data) {
    for(var i in data) {
        if(data[i].rel == "next")
            return data[i].href;
    }
    return null;
}