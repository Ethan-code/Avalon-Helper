import { AfterViewInit, Component } from '@angular/core';
import "jquery"; 
declare var $: JQueryStatic;

// 新增功能:

// 20230626
// 1.新增湖女流panel
// 2.全螢幕
// 3.UX小調整

// 20230628
// 1.湖女更改成放在右邊
// 2.發車結果更新成圖案

// 20230629
// 1.湖女圖片調小
// 2.修正湖女會與排票紀錄重疊的bug

// 20230630
// 1.新增壞車任務失敗張數

@Component({
  selector: 'app-legacy-helper',
  standalone: true,
  imports: [],
  templateUrl: './legacy-helper.component.html',
  styleUrl: './legacy-helper.component.scss'
})
export class LegacyHelperComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    var roles: any = {};
    roles.list = ['', '', '', '', ''];

    var captain: any = {};
    captain.list = ['', '', '', '', ''];

    var vote: any = {};
    vote.list = ['', '', '', '', ''];

    var roles_html =
      "<li>{{num}}號 <input type='text' size='7'  placeholder='name'  /></li>";
    var captain_html =
      "<div class='info'><li><label>{{num}}號派票  <input id='captain' type='checkbox'/> </label></li></div>";

    var vote_html =
      "<div class='info'><label><input id='ticket' type='checkbox'/><div class='ticket'></div><label><input id='mission' type='checkbox'/><div class='mission'></div></label></label></div>";

    var rows_html = '<li>{{num}}號</li>';

    $('.right').css('width', 70 * vote.list.length - 10 + 'px');

    let game1Max = 2;
    let game2Max = 3;
    let game3Max = 2;
    let game4Max = 3;
    let game5Max = 3;
    //刪除並重新產生清單中所有項目
    function showlist() {
      $('.rightTop').html('');
      $('.leftDown').html('');
      $('.rightDown').html('');

      //把每個項目做出來
      for (var i = 0; i < roles.list.length; i++) {
        //取代模板位置成資料replace(要取代的,取代成...)
        var new_role_html = roles_html.replace('{{num}}', (i + 1).toString());
        $('.rightTop').append(new_role_html);
      }

      for (var i = 0; i < 25; i++) {
        var new_caption_html = captain_html.replace(
          '{{num}}',
          ((i % roles.list.length) + 1).toString()
        );
        $('.leftDown').append(new_caption_html);
      }

      for (var i = 1; i <= vote.list.length; i++) {
        for (var j = 1; j <= 25; j++) {
          $('.rightDown').append(vote_html);
        }
      }

      if (roles.list.length == 6) {
        $('.game').css('font-size', '50px');
        $('.game').css('color', 'navy');
        $('.game1').attr('value', '2');
        $('.game2').attr('value', '3');
        $('.game3').attr('value', '4');
        $('.game4').attr('value', '3');
        $('.game5').attr('value', '4');
        game1Max = 2;
        game2Max = 3;
        game3Max = 4;
        game4Max = 3;
        game5Max = 4;
      } else if (roles.list.length == 7) {
        $('.game').css('font-size', '50px');
        $('.game').css('color', 'navy');
        $('.game1').attr('value', '2');
        $('.game2').attr('value', '3');
        $('.game3').attr('value', '3');
        $('.game4').attr('value', '4');
        $('.game5').attr('value', '4');
        game1Max = 2;
        game2Max = 3;
        game3Max = 3;
        game4Max = 4;
        game5Max = 4;
      } else if (roles.list.length >= 8) {
        $('.game').css('font-size', '50px');
        $('.game').css('color', 'navy');
        $('.game1').attr('value', '3');
        $('.game2').attr('value', '4');
        $('.game3').attr('value', '4');
        $('.game4').attr('value', '5');
        $('.game5').attr('value', '5');
        game1Max = 3;
        game2Max = 4;
        game3Max = 4;
        game4Max = 5;
        game5Max = 5;
      } else {
        $('.game').css('font-size', '50px');
        $('.game').css('color', 'navy');
        $('.game1').attr('value', '2');
        $('.game2').attr('value', '3');
        $('.game3').attr('value', '2');
        $('.game4').attr('value', '3');
        $('.game5').attr('value', '3');
        game1Max = 2;
        game2Max = 3;
        game3Max = 2;
        game4Max = 3;
        game5Max = 3;
      }
    }

    showlist();

    $('.game').on('focus', () => {
      $(this).blur();
    });

    var playerCount = 5;
    var left = 440;
    $('.addbtn').click(function () {
      if (roles.list.length < 10) {
        roles.list.push('');
        vote.list.push('');
        left += 70;
        var lakeDiv = $('.lakeDiv');
        lakeDiv.css('left', left + 'px');
        playerCount++;
      }

      showlist();
      $('.right').css('width', 70 * vote.list.length - 10 + 'px');
      var selectElements = document.getElementsByClassName('players');
      for (var i = 0; i < selectElements.length; i++) {
        var select = selectElements[i];
        var option = document.createElement('option');
        option.value = roles.list.length;
        option.text = roles.list.length + '號';
        select.appendChild(option);
      }
      if (roles.list.length >= 7) {
        var firstLakeLady = document.getElementById('firstLakeLady');
        if (firstLakeLady === null) return;
        firstLakeLady.classList.remove('hiddenObj');
      }
    });

    $('.delbtn').click(function () {
      if (roles.list.length > 5) {
        roles.list.pop('');
        vote.list.pop('');
        left -= 70;
        var lakeDiv = $('.lakeDiv');
        lakeDiv.css('left', left + 'px');
        playerCount--;
      }
      showlist();
      $('.right').css('width', 70 * vote.list.length - 10 + 'px');
      if (roles.list.length < 7) {
        var elements = document.getElementsByClassName('lake');
        for (var i = 0; i < elements.length; i++) {
          elements[i].classList.add('hiddenObj');
        }
      }
    });

    var l1 = 0;
    var l2 = 0;
    var l3 = 0;
    $('#firstLake').click(function () {
      var div = document.getElementById('firstLake');
      if (div === null) return;
      if (l1 === 0) {
        l1++;
        div.style.backgroundPosition = 'center';
        var secondLakeLady = document.getElementById('secondLakeLady');
        if (secondLakeLady === null) return;
        secondLakeLady.classList.remove('hiddenObj');
      } else if (l1 === 1) {
        div.style.backgroundPosition = 'right';
        l1--;
      }
    });
    $('#secondLake').click(function () {
      var div = document.getElementById('secondLake');
      if (div === null) return;
      if (l2 === 0) {
        l2++;
        div.style.backgroundPosition = 'center';
        var thirdLakeLady = document.getElementById('thirdLakeLady');
        if (thirdLakeLady === null) return;
        thirdLakeLady.classList.remove('hiddenObj');
      } else if (l2 === 1) {
        div.style.backgroundPosition = 'right';
        l2--;
      }
    });
    $('#thirdLake').click(function () {
      var div = document.getElementById('thirdLake');
      if (div === null) return;
      if (l3 === 0) {
        l3++;
        div.style.backgroundPosition = 'center';
      } else if (l3 === 1) {
        div.style.backgroundPosition = 'right';
        l3--;
      }
    });

    var a = 0;

    $('.game1').click(function () {
      var div = document.getElementById('game1');
      if (div === null) return;
      if (a === 0) {
        a++;
        div.classList.add('hideBefore');
        div.style.backgroundImage =
          "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
        div.style.backgroundColor = 'transparent';
        div.style.backgroundRepeat = 'no-repeat';
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'left';
        $('.game1').attr('value', '');
      } else if (a === 1) {
        div.style.backgroundPosition = 'right';
        $('.game1').css('font-size', '20px');
        $('.game1').css('color', 'white');
        a++;
      } else if (a === 2) {
        div.style.backgroundPosition = 'right';
        $('.game1').attr('value', '2');
        $('.game1').css('font-size', '40px');
        $('.game1').css('color', 'white');
        if (a === game1Max) {
          a = 0;
        } else {
          a++;
        }
      } else if (a === 3) {
        div.style.backgroundPosition = 'right';
        $('.game1').attr('value', '');
        $('.game1').attr('value', '3');
        $('.game1').css('font-size', '40px');
        $('.game1').css('color', 'white');
        if (a === game1Max) {
          a = 0;
        } else {
          a++;
        }
      } else if (a === 4) {
        div.style.backgroundPosition = 'right';
        $('.game1').attr('value', '4');
        $('.game1').css('font-size', '40px');
        $('.game1').css('color', 'white');
        if (a === game1Max) {
          a = 0;
        } else {
          a++;
        }
      } else {
        div.style.backgroundPosition = 'right';
        $('.game1').attr('value', '5');
        $('.game1').css('font-size', '40px');
        $('.game1').css('color', 'white');
        a = 0;
      }
    });

    var b = 0;
    var game2 = $('.game2');
    game2.click(function () {
      var div = document.getElementById('game2');
      if (div === null) return;
      if (b === 0) {
        b++;
        div.classList.add('hideBefore');
        div.style.backgroundImage =
          "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
        div.style.backgroundColor = 'transparent';
        div.style.backgroundRepeat = 'no-repeat';
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'left';
        game2.attr('value', '');
      } else if (b === 1) {
        div.style.backgroundPosition = 'right';
        $('.game2').css('font-size', '20px');
        $('.game2').css('color', 'white');
        b++;
      } else if (b === 2) {
        div.style.backgroundPosition = 'right';
        $('.game2').attr('value', '2');
        $('.game2').css('font-size', '40px');
        $('.game2').css('color', 'white');
        if (b === game2Max) {
          b = 0;
        } else {
          b++;
        }
      } else if (b === 3) {
        div.style.backgroundPosition = 'right';
        $('.game2').attr('value', '');
        $('.game2').attr('value', '3');
        $('.game2').css('font-size', '40px');
        $('.game2').css('color', 'white');
        if (b === game2Max) {
          b = 0;
        } else {
          b++;
        }
      } else if (b === 4) {
        div.style.backgroundPosition = 'right';
        $('.game2').attr('value', '4');
        $('.game2').css('font-size', '40px');
        $('.game2').css('color', 'white');
        if (b === game2Max) {
          b = 0;
        } else {
          b++;
        }
      } else {
        div.style.backgroundPosition = 'right';
        $('.game2').attr('value', '5');
        $('.game2').css('font-size', '40px');
        $('.game2').css('color', 'white');
        b = 0;
      }
    });

    var c = 0;
    var game3 = $('.game3');
    game3.click(function () {
      var div = document.getElementById('game3');
      if (div === null) return;
      if (c === 0) {
        c++;
        div.classList.add('hideBefore');
        div.style.backgroundImage =
          "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
        div.style.backgroundColor = 'transparent';
        div.style.backgroundRepeat = 'no-repeat';
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'left';
        game3.attr('value', '');
      } else if (c === 1) {
        div.style.backgroundPosition = 'right';
        game3.css('font-size', '20px');
        game3.css('color', 'white');
        c++;
      } else if (c === 2) {
        div.style.backgroundPosition = 'right';
        game3.attr('value', '2');
        game3.css('font-size', '40px');
        game3.css('color', 'white');
        if (c === game3Max) {
          c = 0;
        } else {
          c++;
        }
      } else if (c === 3) {
        div.style.backgroundPosition = 'right';
        game3.attr('value', '');
        game3.attr('value', '3');
        game3.css('font-size', '40px');
        game3.css('color', 'white');
        if (c === game3Max) {
          c = 0;
        } else {
          c++;
        }
      } else if (c === 4) {
        div.style.backgroundPosition = 'right';
        game3.attr('value', '4');
        game3.css('font-size', '40px');
        game3.css('color', 'white');
        if (c === game3Max) {
          c = 0;
        } else {
          c++;
        }
      } else {
        div.style.backgroundPosition = 'right';
        game3.attr('value', '5');
        game3.css('font-size', '40px');
        game3.css('color', 'white');
        c = 0;
      }
    });

    var d = 0;
    var game4 = $('.game4');
    game4.click(function () {
      var div = document.getElementById('game4');
      if (div === null) return;
      if (d === 0) {
        d++;
        div.classList.add('hideBefore');
        div.style.backgroundImage =
          "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
        div.style.backgroundColor = 'transparent';
        div.style.backgroundRepeat = 'no-repeat';
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'left';
        game4.attr('value', '');
      } else if (d === 1) {
        div.style.backgroundPosition = 'right';
        game4.css('font-size', '20px');
        game4.css('color', 'white');
        d++;
      } else if (d === 2) {
        div.style.backgroundPosition = 'right';
        game4.attr('value', '2');
        game4.css('font-size', '40px');
        game4.css('color', 'white');
        if (d === game4Max) {
          d = 0;
        } else {
          d++;
        }
      } else if (d === 3) {
        div.style.backgroundPosition = 'right';
        game4.attr('value', '');
        game4.attr('value', '3');
        game4.css('font-size', '40px');
        game4.css('color', 'white');
        if (d === game4Max) {
          d = 0;
        } else {
          d++;
        }
      } else if (d === 4) {
        div.style.backgroundPosition = 'right';
        game4.attr('value', '4');
        game4.css('font-size', '40px');
        game4.css('color', 'white');
        if (d === game4Max) {
          d = 0;
        } else {
          d++;
        }
      } else {
        div.style.backgroundPosition = 'right';
        game4.attr('value', '5');
        game4.css('font-size', '40px');
        game4.css('color', 'white');
        d = 0;
      }
    });

    var e = 0;
    var game5 = $('.game5');
    game5.click(function () {
      var div = document.getElementById('game5');
      if (div === null) return;
      if (e === 0) {
        e++;
        div.classList.add('hideBefore');
        div.style.backgroundImage =
          "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
        div.style.backgroundColor = 'transparent';
        div.style.backgroundRepeat = 'no-repeat';
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'left';
        game5.attr('value', '');
      } else if (e === 1) {
        div.style.backgroundPosition = 'right';
        game5.css('font-size', '20px');
        game5.css('color', 'white');
        e++;
      } else if (e === 2) {
        div.style.backgroundPosition = 'right';
        game5.attr('value', '2');
        game5.css('font-size', '40px');
        game5.css('color', 'white');
        if (e === game5Max) {
          e = 0;
        } else {
          e++;
        }
      } else if (e === 3) {
        div.style.backgroundPosition = 'right';
        game5.attr('value', '');
        game5.attr('value', '3');
        game5.css('font-size', '40px');
        game5.css('color', 'white');
        if (e === game5Max) {
          e = 0;
        } else {
          e++;
        }
      } else if (e === 4) {
        div.style.backgroundPosition = 'right';
        game5.attr('value', '4');
        game5.css('font-size', '40px');
        game5.css('color', 'white');
        if (e === game5Max) {
          e = 0;
        } else {
          e++;
        }
      } else {
        div.style.backgroundPosition = 'right';
        game5.attr('value', '5');
        game5.css('font-size', '40px');
        game5.css('color', 'white');
        e = 0;
      }
    });

    let fullscreen: any;
    let fsEnter = document.getElementById('fullscr');
    if (fsEnter === null) return;
    fsEnter.addEventListener('click', function (e) {
      e.preventDefault();
      if (!fullscreen) {
        fullscreen = true;
        document.documentElement.requestFullscreen();
      } else {
        fullscreen = false;
        document.exitFullscreen();
      }
    });
  }
}
