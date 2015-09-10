//page calculate
var pageCalculate = exports.pageCalculate = function(curPage, totalNum){
  var pageNum = 2;
  var plus = totalNum%pageNum === 0?0:1;
  var totalPage = parseInt(totalNum/pageNum) +plus;
  if(totalPage <= 0) totalPage = 1;
  if(curPage >= totalPage) curPage = totalPage;
  if(curPage <= 1) curPage = 1;
  var skipNum = (curPage -1)*pageNum;
  var limitNum = pageNum;
  return {curPage:curPage, totalPage:totalPage, skipNum:skipNum, limitNum:limitNum}
}
