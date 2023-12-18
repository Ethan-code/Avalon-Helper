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

enum RoundResult {
  NotYet = 'NotYet',
  Success = 'Success',
  Failure = 'Failure',
  NoPlay = 'NoPlay',
}

enum LakeResult {
  NotYet = 'NotYet',
  Good = 'Good',
  Bad = 'Bad',
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

  public round1Max = 2;
  public round2Max = 3;
  public round3Max = 2;
  public round4Max = 3;
  public round5Max = 3;

  private left = 440;

  public lake1Result = LakeResult.NotYet;
  public lake2Result = LakeResult.NotYet;
  public lake3Result = LakeResult.NotYet;

  public round1Result = RoundResult.NotYet;
  public round2Result = RoundResult.NotYet;
  public round3Result = RoundResult.NotYet;
  public round4Result = RoundResult.NotYet;
  public round5Result = RoundResult.NotYet;

  public playerCount = 5;
  public get playerCounts(): number[] {
    return Array.from({ length: this.playerCount }, (_, index) => index + 1);
  }

  public ngAfterViewInit(): void {
    $('.right').css('width', 70 * this.vote.list.length - 10 + 'px');

    this.showlist();
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

  public onRound1Click() {
    if (this.round1Result === RoundResult.NotYet) {
      this.round1Result = RoundResult.Success;
    } else if (this.round1Result === RoundResult.Success) {
      this.round1Result = RoundResult.Failure;
    } else if (this.round1Result === RoundResult.Failure) {
      this.round1Result = RoundResult.NotYet;
    }
  }

  public onRound2Click() {
    if (this.round2Result === RoundResult.NotYet) {
      this.round2Result = RoundResult.Success;
    } else if (this.round2Result === RoundResult.Success) {
      this.round2Result = RoundResult.Failure;
    } else if (this.round2Result === RoundResult.Failure) {
      this.round2Result = RoundResult.NotYet;
    }
  }

  public onRound3Click() {
    if (this.round3Result === RoundResult.NotYet) {
      this.round3Result = RoundResult.Success;
    } else if (this.round3Result === RoundResult.Success) {
      this.round3Result = RoundResult.Failure;
    } else if (this.round3Result === RoundResult.Failure) {
      this.round3Result = RoundResult.NotYet;
    }
  }

  public onRound4Click() {
    if (this.round4Result === RoundResult.NotYet) {
      this.round4Result = RoundResult.Success;
    } else if (this.round4Result === RoundResult.Success) {
      this.round4Result = RoundResult.Failure;
    } else if (this.round4Result === RoundResult.Failure) {
      this.round4Result = RoundResult.NotYet;
    }
  }

  public onRound5Click() {
    if (this.round5Result === RoundResult.NotYet) {
      this.round5Result = RoundResult.Success;
    } else if (this.round5Result === RoundResult.Success) {
      this.round5Result = RoundResult.Failure;
    } else if (this.round5Result === RoundResult.Failure) {
      this.round5Result = RoundResult.NotYet;
    }
  }

  public onFirstLakeClick() {
    if (this.lake1Result === LakeResult.NotYet) {
      this.lake1Result = LakeResult.Bad;
    } else if (this.lake1Result === LakeResult.Bad) {
      this.lake1Result = LakeResult.Good;
    } else if (this.lake1Result === LakeResult.Good) {
      this.lake1Result = LakeResult.NotYet;
    }
  }

  public onSecondLakeClick() {
    if (this.lake2Result === LakeResult.NotYet) {
      this.lake2Result = LakeResult.Bad;
    } else if (this.lake2Result === LakeResult.Bad) {
      this.lake2Result = LakeResult.Good;
    } else if (this.lake2Result === LakeResult.Good) {
      this.lake2Result = LakeResult.NotYet;
    }
  }

  public onThirdLakeClick() {
    if (this.lake3Result === LakeResult.NotYet) {
      this.lake3Result = LakeResult.Bad;
    } else if (this.lake3Result === LakeResult.Bad) {
      this.lake3Result = LakeResult.Good;
    } else if (this.lake3Result === LakeResult.Good) {
      this.lake3Result = LakeResult.NotYet;
    }
  }

  public getRoundResult(roundResult: RoundResult) {
    if (roundResult === RoundResult.Success) {
      return 'left';
    } else if (roundResult === RoundResult.Failure) {
      return 'right';
    } else {
      return 'center';
    }
  }

  public getLakeResult(lakeResult: LakeResult) {
    if (lakeResult === LakeResult.Good) {
      return 'right';
    } else if (lakeResult === LakeResult.Bad) {
      return 'center';
    } else {
      return 'left';
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
      this.round1Max = 2;
      this.round2Max = 3;
      this.round3Max = 4;
      this.round4Max = 3;
      this.round5Max = 4;
    } else if (this.roles.list.length == 7) {
      this.round1Max = 2;
      this.round2Max = 3;
      this.round3Max = 3;
      this.round4Max = 4;
      this.round5Max = 4;
    } else if (this.roles.list.length >= 8) {
      this.round1Max = 3;
      this.round2Max = 4;
      this.round3Max = 4;
      this.round4Max = 5;
      this.round5Max = 5;
    } else {
      this.round1Max = 2;
      this.round2Max = 3;
      this.round3Max = 2;
      this.round4Max = 3;
      this.round5Max = 3;
    }
  }
}
