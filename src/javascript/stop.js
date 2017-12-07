$(document).ready(function() {
  $("#stop").click(function(e){
    var num = 3;
    var time = "hi";
    var turns = 1;   
    var totalDamage = 2; 
    var totalDps = 3; 
    var totalDpt = "hello"; 
    var avgTDamage = 3;
    var highTDamage = 4;   

    $('<tr>').append(
      $('<td>').text(num),
      $('<td>').text(time),
      $('<td>').text(turns),
      $('<td>').text(totalDamage),
      $('<td>').text(totalDps),
      $('<td>').text(totalDpt),
      $('<td>').text(avgTDamage),
      $('<td>').text(highTDamage)
    ).appendTo('#parseTable tbody')

  });


});