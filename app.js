var app = angular.module('lookup', []);

app.controller('AppCtrl', function ($scope, $http) {
    $scope.filterData = {};

    $scope.search = function () {
        if($scope.orgname.length >= 3) {
            var url = "http://data.brreg.no/enhetsregisteret/enhet.json";
            var params = {
                size: 10,
                $filter: makeFilter($scope)
            };

            $http.get(url, {params: params}, {})
                .then(function (response) {
                    $scope.clearLookup();
                    $scope.search_result = response.data;
                });
        } else {
            $scope.clearSearch();
        }
    };
    
    $scope.clearSearch = function () {
        $scope.search_result = null;
    };

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
        $scope.org_data = null;
    };

    $scope.prev = function() {
        if(url = prevUrl($scope.search_result.links)) {
            $http.get(url, {}, {})
                .then(function (response) {
                    $scope.page = response.data.page.page + 1;
                    $scope.search_result = response.data;
                });
        }
    };

    $scope.next = function() {
        if(url = nextUrl($scope.search_result.links)) {
            $http.get(url, {}, {})
                .then(function (response) {
                    $scope.page = response.data.page.page + 1;
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

function joinArray(sep, a) {
    var str = "";
    for(var i in a) {
        if(a[i] != "") {
            if(i != 0) {
                 str += sep;
            }
            str += a[i]
        }
    }
    return str;
}

function makeFilter(scope) {
    return joinArray(" and ", [
        scope.orgname ? "startswith(navn,'" + scope.orgname + "')" : "",
        scope.filterData.min_employees > 0 ? "antallAnsatte ge " + scope.filterData.min_employees : "",
        scope.filterData.max_employees ? "antallAnsatte le " + scope.filterData.max_employees : "",
        scope.filterData.from_date ? "stiftelsesdato ge datetime'" + new Date(scope.filterData.from_date).toJSON() + "'": "",
        scope.filterData.to_date ? "stiftelsesdato le datetime'" + new Date(scope.filterData.to_date).toJSON() + "'" : "",
    ]);
}