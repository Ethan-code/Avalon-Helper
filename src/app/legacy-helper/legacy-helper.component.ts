import { CommonModule } from '@angular/common';
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

enum GameResult {
  Success = 'Success',
  Fail = 'Fail',
  Pending = 'Pending'
}

@Component({
  selector: 'app-legacy-helper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legacy-helper.component.html',
  styleUrl: './legacy-helper.component.scss',
})
export class LegacyHelperComponent implements AfterViewInit {
  private isFullscreen: boolean = false;
  private roles: any = {
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

  public game1Max = 2;
  public game2Max = 3;
  public game3Max = 2;
  public game4Max = 3;
  public game5Max = 3;

  private left = 440;

  private l1 = 0;
  private l2 = 0;
  private l3 = 0;

  public game1Result = GameResult.Pending;
  public game2Result = GameResult.Pending;
  public game3Result = GameResult.Pending;
  public game4Result = GameResult.Pending;
  public game5Result = GameResult.Pending;

  public playerCount = 5;
  public get playerCounts(): number[] {
    return Array.from({ length: this.playerCount }, (_, index) => index + 1);
  }

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
    if (this.game1Result === GameResult.Pending) {
      this.game1Result = GameResult.Success
    } else if (this.game1Result === GameResult.Success) {
      this.game1Result = GameResult.Fail
    } else  if (this.game1Result === GameResult.Fail) {
      this.game1Result = GameResult.Pending;
    }
  }

  public onGame2Click() {
    if (this.game2Result === GameResult.Pending) {
      this.game2Result = GameResult.Success
    } else if (this.game2Result === GameResult.Success) {
      this.game2Result = GameResult.Fail
    } else  if (this.game2Result === GameResult.Fail) {
      this.game2Result = GameResult.Pending;
    }
  }

  public onGame3Click() {
    if (this.game3Result === GameResult.Pending) {
      this.game3Result = GameResult.Success
    } else if (this.game3Result === GameResult.Success) {
      this.game3Result = GameResult.Fail
    } else  if (this.game3Result === GameResult.Fail) {
      this.game3Result = GameResult.Pending;
    }
  }

  public onGame4Click() {
    if (this.game4Result === GameResult.Pending) {
      this.game4Result = GameResult.Success
    } else if (this.game4Result === GameResult.Success) {
      this.game4Result = GameResult.Fail
    } else  if (this.game4Result === GameResult.Fail) {
      this.game4Result = GameResult.Pending;
    }
  }

  public onGame5Click() {
    if (this.game5Result === GameResult.Pending) {
      this.game5Result = GameResult.Success
    } else if (this.game5Result === GameResult.Success) {
      this.game5Result = GameResult.Fail
    } else  if (this.game5Result === GameResult.Fail) {
      this.game5Result = GameResult.Pending;
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

  public getGameResult(gameResult: GameResult) {
    if (gameResult === GameResult.Success) {
      return 'left';
    } else if (gameResult === GameResult.Fail) {
      return 'right'
    } else {
      return 'center'
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
      this.game1Max = 2;
      this.game2Max = 3;
      this.game3Max = 4;
      this.game4Max = 3;
      this.game5Max = 4;
    } else if (this.roles.list.length == 7) {
      this.game1Max = 2;
      this.game2Max = 3;
      this.game3Max = 3;
      this.game4Max = 4;
      this.game5Max = 4;
    } else if (this.roles.list.length >= 8) {
      this.game1Max = 3;
      this.game2Max = 4;
      this.game3Max = 4;
      this.game4Max = 5;
      this.game5Max = 5;
    } else {
      this.game1Max = 2;
      this.game2Max = 3;
      this.game3Max = 2;
      this.game4Max = 3;
      this.game5Max = 3;
    }
  }
}
