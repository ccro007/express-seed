var utils = {};

utils.getObjectsByIds = function(ids, getObjectsByIds, getIdFromObject, callback) {
  if (arguments.length == 3) {
    callback = getIdFromObject;
    getIdFromObject = null;
  }

  getObjectsByIds(ids, function(err, results) {
    var objectMap = {};
    var objects = [];
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      var id = getIdFromObject ? getIdFromObject(result) : result.id;
      objectMap[id] = result;
    }

    for (var j = 0; j < ids.length; i++) {
      var object = objectMap[ids[j]];
      if (object) {
        objects.push(object);
      }
    }
    callback(null, objects);
  });
};


utils.calculateTotalPages = function(itemsPerPage, totalItems) {
  var totalPages = itemsPerPage < 1 ? 1 : Math.ceil(totalItems / itemsPerPage);
  return Math.max(totalPages || 0, 1);
};

utils.getPaginationObjects = function(params, pageIndex, pageSize, getCountAndIds, getObjectsByIds, callback) {
  var _params, _pageIndex, _pageSize, _getCountAndIds, _getObjectsByIds;
  var getCountAndIdsCallback = function(err, totalCount, ids) {
    if (err) {
      callback(err);
    } else {
      _getObjectsByIds(ids, function(err, results) {
        if (err) {
          callback(err);
        } else {
          var objectSet = {
            pagination: {
              page: _pageIndex + 1,
              totalItems: totalCount,
              itemsPerPage: _pageSize,
              totalPages: utils.calculateTotalPages(_pageSize, totalCount),
            },
            items: results
          };
          callback(null, objectSet);
        }
      });
    }
  };

  if (arguments.length == 5) {
    _params = null;
    _pageIndex = params;
    _pageSize = pageIndex;
    _getCountAndIds = pageSize;
    _getObjectsByIds = getCountAndIds;
    callback = getObjectsByIds;
  } else {
    _params = params;
    _pageIndex = pageIndex;
    _pageSize = pageSize;
    _getCountAndIds = getCountAndIds;
    _getObjectsByIds = getObjectsByIds;
  }
  if (!_params || _params.length === 0) {
    _getCountAndIds(_pageIndex, _pageSize, getCountAndIdsCallback);
  } else {
    _getCountAndIds(_params, _pageIndex, _pageSize, getCountAndIdsCallback);
  }
};

utils.getObjectsFromMaxId = function(params, maxId, count, getIds, getObjectsByIds, callback) {
  getIds(params, function(err, ids) {
    if (err) {
      callback(err);
    } else {
      if (typeof(maxId) == 'string') {
        maxId = parseInt(maxId);
      }
      var start_index = ids.indexOf(maxId) + 1;
      var pagedIds = ids.slice(start_index, start_index + count);
      getObjectsByIds(pagedIds, callback);
    }
  });
};

utils.getObject = function(id, getObjectsByIds, callback) {
  getObjectsByIds([id], function(err, results) {
    if (err) {
      callback(err);
    } else {
      if (results.length === 0) {
        callback(null, null);
      } else {
        callback(null, results[0]);
      }
    }
  });
};

module.exports = utils;
