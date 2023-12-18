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

  public roundMaxs = [2, 3, 2, 3, 3];

  private left = 440;

  public lakeResults = [
    LakeResult.NotYet,
    LakeResult.NotYet,
    LakeResult.NotYet,
  ];
  public get showlakeLogics(): boolean[] {
    return [
      this.playerCount < 7,
      this.playerCount < 7 || this.lakeResults[0] === 'NotYet',
      this.playerCount < 7 ||
        this.lakeResults[0] === 'NotYet' ||
        this.lakeResults[1] === 'NotYet',
    ];
  }

  public roundResults = [
    RoundResult.NotYet,
    RoundResult.NotYet,
    RoundResult.NotYet,
    RoundResult.NotYet,
    RoundResult.NotYet,
  ];

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
  }

  public trackByFn(index: number, item: any) {
    return index;
  }

  public onRoundClick(roundResult: RoundResult, index: number) {
    if (roundResult === RoundResult.NotYet) {
      this.roundResults[index] = RoundResult.Success;
    } else if (roundResult === RoundResult.Success) {
      this.roundResults[index] = RoundResult.Failure;
    } else if (roundResult === RoundResult.Failure) {
      this.roundResults[index] = RoundResult.NotYet;
    }
  }

  public onLakeClick(lakeResult: LakeResult, index: number) {
    if (lakeResult === LakeResult.NotYet) {
      this.lakeResults[index] = LakeResult.Bad;
    } else if (lakeResult === LakeResult.Bad) {
      this.lakeResults[index] = LakeResult.Good;
    } else if (lakeResult === LakeResult.Good) {
      this.lakeResults[index] = LakeResult.NotYet;
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

  public getRoundTextColor(roundResult: RoundResult) {
    return roundResult === 'NotYet' ? 'navy' : 'white';
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
      this.roundMaxs = [2, 3, 4, 3, 4];
    } else if (this.roles.list.length == 7) {
      this.roundMaxs = [2, 3, 3, 4, 4];
    } else if (this.roles.list.length >= 8) {
      this.roundMaxs = [3, 4, 4, 5, 5];
    } else {
      this.roundMaxs = [2, 3, 2, 3, 3];
    }
  }
}
