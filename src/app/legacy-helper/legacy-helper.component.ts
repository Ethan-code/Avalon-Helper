import { AfterViewInit, Component } from '@angular/core';
import 'jquery';
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
  styleUrl: './legacy-helper.component.scss',
})
export class LegacyHelperComponent implements AfterViewInit {
  private isFullscreen: boolean = false;
  private roles: any = {
    list: ['', '', '', '', ''],
  };
  private captain: any = {
    list: ['', '', '', '', ''],
  };
  private vote: any = {
    list: ['', '', '', '', ''],
  };

  private roles_html =
    "<li>{{num}}號 <input type='text' size='7'  placeholder='name'  /></li>";
  private captain_html =
    "<div class='info'><li><label>{{num}}號派票  <input id='captain' type='checkbox'/> </label></li></div>";
  private vote_html =
    "<div class='info'><label><input id='ticket' type='checkbox'/><div class='ticket'></div><label><input id='mission' type='checkbox'/><div class='mission'></div></label></label></div>";

  private game1Max = 2;
  private game2Max = 3;
  private game3Max = 2;
  private game4Max = 3;
  private game5Max = 3;

  private playerCount = 5;
  private left = 440;

  private l1 = 0;
  private l2 = 0;
  private l3 = 0;

  private a = 0;
  private b = 0;
  private c = 0;
  private d = 0;
  private e = 0;

  ngAfterViewInit(): void {
    $('.right').css('width', 70 * this.vote.list.length - 10 + 'px');

    this.showlist();

    $('.game').on('focus', () => {
      $(this).blur();
    });
  }

  public onFullscreenClick(): void {
    if (!this.isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.isFullscreen = !this.isFullscreen;
  }

  public onAddClick() {
    if (this.roles.list.length < 10) {
      this.roles.list.push('');
      this.vote.list.push('');
      this.left += 70;
      var lakeDiv = $('.lakeDiv');
      lakeDiv.css('left', this.left + 'px');
      this.playerCount++;
    }

    this.showlist();
    $('.right').css('width', 70 * this.vote.list.length - 10 + 'px');
    var selectElements = document.getElementsByClassName('players');
    for (var i = 0; i < selectElements.length; i++) {
      var select = selectElements[i];
      var option = document.createElement('option');
      option.value = this.roles.list.length;
      option.text = this.roles.list.length + '號';
      select.appendChild(option);
    }
    if (this.roles.list.length >= 7) {
      var firstLakeLady = document.getElementById('firstLakeLady');
      if (firstLakeLady === null) return;
      firstLakeLady.classList.remove('hiddenObj');
    }
  }

  public onDeleteClick() {
    if (this.roles.list.length > 5) {
      this.roles.list.pop('');
      this.vote.list.pop('');
      this.left -= 70;
      var lakeDiv = $('.lakeDiv');
      lakeDiv.css('left', this.left + 'px');
      this.playerCount--;
    }
    this.showlist();
    $('.right').css('width', 70 * this.vote.list.length - 10 + 'px');
    if (this.roles.list.length < 7) {
      var elements = document.getElementsByClassName('lake');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add('hiddenObj');
      }
    }
  }

  public onGame1Click() {
    var div = document.getElementById('game1');
    if (div === null) return;
    if (this.a === 0) {
      this.a++;
      div.classList.add('hideBefore');
      div.style.backgroundImage =
        "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
      div.style.backgroundColor = 'transparent';
      div.style.backgroundRepeat = 'no-repeat';
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'left';
      $('.game1').attr('value', '');
    } else if (this.a === 1) {
      div.style.backgroundPosition = 'right';
      $('.game1').css('font-size', '20px');
      $('.game1').css('color', 'white');
      this.a++;
    } else if (this.a === 2) {
      div.style.backgroundPosition = 'right';
      $('.game1').attr('value', '2');
      $('.game1').css('font-size', '40px');
      $('.game1').css('color', 'white');
      if (this.a === this.game1Max) {
        this.a = 0;
      } else {
        this.a++;
      }
    } else if (this.a === 3) {
      div.style.backgroundPosition = 'right';
      $('.game1').attr('value', '');
      $('.game1').attr('value', '3');
      $('.game1').css('font-size', '40px');
      $('.game1').css('color', 'white');
      if (this.a === this.game1Max) {
        this.a = 0;
      } else {
        this.a++;
      }
    } else if (this.a === 4) {
      div.style.backgroundPosition = 'right';
      $('.game1').attr('value', '4');
      $('.game1').css('font-size', '40px');
      $('.game1').css('color', 'white');
      if (this.a === this.game1Max) {
        this.a = 0;
      } else {
        this.a++;
      }
    } else {
      div.style.backgroundPosition = 'right';
      $('.game1').attr('value', '5');
      $('.game1').css('font-size', '40px');
      $('.game1').css('color', 'white');
      this.a = 0;
    }
  }

  public onGame2Click() {
    var div = document.getElementById('game2');
    if (div === null) return;
    if (this.b === 0) {
      this.b++;
      div.classList.add('hideBefore');
      div.style.backgroundImage =
        "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
      div.style.backgroundColor = 'transparent';
      div.style.backgroundRepeat = 'no-repeat';
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'left';
      $('.game2').attr('value', '');
    } else if (this.b === 1) {
      div.style.backgroundPosition = 'right';
      $('.game2').css('font-size', '20px');
      $('.game2').css('color', 'white');
      this.b++;
    } else if (this.b === 2) {
      div.style.backgroundPosition = 'right';
      $('.game2').attr('value', '2');
      $('.game2').css('font-size', '40px');
      $('.game2').css('color', 'white');
      if (this.b === this.game2Max) {
        this.b = 0;
      } else {
        this.b++;
      }
    } else if (this.b === 3) {
      div.style.backgroundPosition = 'right';
      $('.game2').attr('value', '');
      $('.game2').attr('value', '3');
      $('.game2').css('font-size', '40px');
      $('.game2').css('color', 'white');
      if (this.b === this.game2Max) {
        this.b = 0;
      } else {
        this.b++;
      }
    } else if (this.b === 4) {
      div.style.backgroundPosition = 'right';
      $('.game2').attr('value', '4');
      $('.game2').css('font-size', '40px');
      $('.game2').css('color', 'white');
      if (this.b === this.game2Max) {
        this.b = 0;
      } else {
        this.b++;
      }
    } else {
      div.style.backgroundPosition = 'right';
      $('.game2').attr('value', '5');
      $('.game2').css('font-size', '40px');
      $('.game2').css('color', 'white');
      this.b = 0;
    }
  }

  public onGame3Click() {
    var div = document.getElementById('game3');
    if (div === null) return;
    if (this.c === 0) {
      this.c++;
      div.classList.add('hideBefore');
      div.style.backgroundImage =
        "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
      div.style.backgroundColor = 'transparent';
      div.style.backgroundRepeat = 'no-repeat';
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'left';
      $('.game3').attr('value', '');
    } else if (this.c === 1) {
      div.style.backgroundPosition = 'right';
      $('.game3').css('font-size', '20px');
      $('.game3').css('color', 'white');
      this.c++;
    } else if (this.c === 2) {
      div.style.backgroundPosition = 'right';
      $('.game3').attr('value', '2');
      $('.game3').css('font-size', '40px');
      $('.game3').css('color', 'white');
      if (this.c === this.game3Max) {
        this.c = 0;
      } else {
        this.c++;
      }
    } else if (this.c === 3) {
      div.style.backgroundPosition = 'right';
      $('.game3').attr('value', '');
      $('.game3').attr('value', '3');
      $('.game3').css('font-size', '40px');
      $('.game3').css('color', 'white');
      if (this.c === this.game3Max) {
        this.c = 0;
      } else {
        this.c++;
      }
    } else if (this.c === 4) {
      div.style.backgroundPosition = 'right';
      $('.game3').attr('value', '4');
      $('.game3').css('font-size', '40px');
      $('.game3').css('color', 'white');
      if (this.c === this.game3Max) {
        this.c = 0;
      } else {
        this.c++;
      }
    } else {
      div.style.backgroundPosition = 'right';
      $('.game3').attr('value', '5');
      $('.game3').css('font-size', '40px');
      $('.game3').css('color', 'white');
      this.c = 0;
    }
  }

  public onGame4Click() {
    var div = document.getElementById('game4');
    if (div === null) return;
    if (this.d === 0) {
      this.d++;
      div.classList.add('hideBefore');
      div.style.backgroundImage =
        "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
      div.style.backgroundColor = 'transparent';
      div.style.backgroundRepeat = 'no-repeat';
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'left';
      $('.game4').attr('value', '');
    } else if (this.d === 1) {
      div.style.backgroundPosition = 'right';
      $('.game4').css('font-size', '20px');
      $('.game4').css('color', 'white');
      this.d++;
    } else if (this.d === 2) {
      div.style.backgroundPosition = 'right';
      $('.game4').attr('value', '2');
      $('.game4').css('font-size', '40px');
      $('.game4').css('color', 'white');
      if (this.d === this.game4Max) {
        this.d = 0;
      } else {
        this.d++;
      }
    } else if (this.d === 3) {
      div.style.backgroundPosition = 'right';
      $('.game4').attr('value', '');
      $('.game4').attr('value', '3');
      $('.game4').css('font-size', '40px');
      $('.game4').css('color', 'white');
      if (this.d === this.game4Max) {
        this.d = 0;
      } else {
        this.d++;
      }
    } else if (this.d === 4) {
      div.style.backgroundPosition = 'right';
      $('.game4').attr('value', '4');
      $('.game4').css('font-size', '40px');
      $('.game4').css('color', 'white');
      if (this.d === this.game4Max) {
        this.d = 0;
      } else {
        this.d++;
      }
    } else {
      div.style.backgroundPosition = 'right';
      $('.game4').attr('value', '5');
      $('.game4').css('font-size', '40px');
      $('.game4').css('color', 'white');
      this.d = 0;
    }
  }

  public onGame5Click() {
    var div = document.getElementById('game5');
    if (div === null) return;
    if (this.e === 0) {
      this.e++;
      div.classList.add('hideBefore');
      div.style.backgroundImage =
        "url('https://andyventure.com/wp-content/uploads/boardgame/avalon/marker_score.webp')";
      div.style.backgroundColor = 'transparent';
      div.style.backgroundRepeat = 'no-repeat';
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'left';
      $('.game5').attr('value', '');
    } else if (this.e === 1) {
      div.style.backgroundPosition = 'right';
      $('.game5').css('font-size', '20px');
      $('.game5').css('color', 'white');
      this.e++;
    } else if (this.e === 2) {
      div.style.backgroundPosition = 'right';
      $('.game5').attr('value', '2');
      $('.game5').css('font-size', '40px');
      $('.game5').css('color', 'white');
      if (this.e === this.game5Max) {
        this.e = 0;
      } else {
        this.e++;
      }
    } else if (this.e === 3) {
      div.style.backgroundPosition = 'right';
      $('.game5').attr('value', '');
      $('.game5').attr('value', '3');
      $('.game5').css('font-size', '40px');
      $('.game5').css('color', 'white');
      if (this.e === this.game5Max) {
        this.e = 0;
      } else {
        this.e++;
      }
    } else if (this.e === 4) {
      div.style.backgroundPosition = 'right';
      $('.game5').attr('value', '4');
      $('.game5').css('font-size', '40px');
      $('.game5').css('color', 'white');
      if (this.e === this.game5Max) {
        this.e = 0;
      } else {
        this.e++;
      }
    } else {
      div.style.backgroundPosition = 'right';
      $('.game5').attr('value', '5');
      $('.game5').css('font-size', '40px');
      $('.game5').css('color', 'white');
      this.e = 0;
    }
  }

  public onFirstLakeClick() {
    var div = document.getElementById('firstLake');
    if (div === null) return;
    if (this.l1 === 0) {
      this.l1++;
      div.style.backgroundPosition = 'center';
      var secondLakeLady = document.getElementById('secondLakeLady');
      if (secondLakeLady === null) return;
      secondLakeLady.classList.remove('hiddenObj');
    } else if (this.l1 === 1) {
      div.style.backgroundPosition = 'right';
      this.l1--;
    }
  }

  public onSecondLakeClick() {
    var div = document.getElementById('secondLake');
    if (div === null) return;
    if (this.l2 === 0) {
      this.l2++;
      div.style.backgroundPosition = 'center';
      var thirdLakeLady = document.getElementById('thirdLakeLady');
      if (thirdLakeLady === null) return;
      thirdLakeLady.classList.remove('hiddenObj');
    } else if (this.l2 === 1) {
      div.style.backgroundPosition = 'right';
      this.l2--;
    }
  }

  public onThirdLakeClick() {
    var div = document.getElementById('thirdLake');
    if (div === null) return;
    if (this.l3 === 0) {
      this.l3++;
      div.style.backgroundPosition = 'center';
    } else if (this.l3 === 1) {
      div.style.backgroundPosition = 'right';
      this.l3--;
    }
  }

  private showlist() {
    //刪除並重新產生清單中所有項目

    $('.rightTop').html('');
    $('.leftDown').html('');
    $('.rightDown').html('');

    //把每個項目做出來
    for (var i = 0; i < this.roles.list.length; i++) {
      //取代模板位置成資料replace(要取代的,取代成...)
      var new_role_html = this.roles_html.replace(
        '{{num}}',
        (i + 1).toString()
      );
      $('.rightTop').append(new_role_html);
    }

    for (var i = 0; i < 25; i++) {
      var new_caption_html = this.captain_html.replace(
        '{{num}}',
        ((i % this.roles.list.length) + 1).toString()
      );
      $('.leftDown').append(new_caption_html);
    }

    for (var i = 1; i <= this.vote.list.length; i++) {
      for (var j = 1; j <= 25; j++) {
        $('.rightDown').append(this.vote_html);
      }
    }

    if (this.roles.list.length == 6) {
      $('.game').css('font-size', '50px');
      $('.game').css('color', 'navy');
      $('.game1').attr('value', '2');
      $('.game2').attr('value', '3');
      $('.game3').attr('value', '4');
      $('.game4').attr('value', '3');
      $('.game5').attr('value', '4');
      this.game1Max = 2;
      this.game2Max = 3;
      this.game3Max = 4;
      this.game4Max = 3;
      this.game5Max = 4;
    } else if (this.roles.list.length == 7) {
      $('.game').css('font-size', '50px');
      $('.game').css('color', 'navy');
      $('.game1').attr('value', '2');
      $('.game2').attr('value', '3');
      $('.game3').attr('value', '3');
      $('.game4').attr('value', '4');
      $('.game5').attr('value', '4');
      this.game1Max = 2;
      this.game2Max = 3;
      this.game3Max = 3;
      this.game4Max = 4;
      this.game5Max = 4;
    } else if (this.roles.list.length >= 8) {
      $('.game').css('font-size', '50px');
      $('.game').css('color', 'navy');
      $('.game1').attr('value', '3');
      $('.game2').attr('value', '4');
      $('.game3').attr('value', '4');
      $('.game4').attr('value', '5');
      $('.game5').attr('value', '5');
      this.game1Max = 3;
      this.game2Max = 4;
      this.game3Max = 4;
      this.game4Max = 5;
      this.game5Max = 5;
    } else {
      $('.game').css('font-size', '50px');
      $('.game').css('color', 'navy');
      $('.game1').attr('value', '2');
      $('.game2').attr('value', '3');
      $('.game3').attr('value', '2');
      $('.game4').attr('value', '3');
      $('.game5').attr('value', '3');
      this.game1Max = 2;
      this.game2Max = 3;
      this.game3Max = 2;
      this.game4Max = 3;
      this.game5Max = 3;
    }
  }
}
