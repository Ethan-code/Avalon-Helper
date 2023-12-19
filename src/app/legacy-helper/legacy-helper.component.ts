import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
export class LegacyHelperComponent {
  private isFullscreen: boolean = false;

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
  public voteCount = 25;
  public get voteCounts(): number[] {
    return Array.from({ length: this.voteCount }, (_, index) => index + 1);
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
    if (this.playerCount < 10) {
      this.playerCount++;
    }
    this.updateRoundMaxs();
  }

  public onDeleteClick() {
    if (this.playerCount > 5) {
      this.playerCount--;
    }
    this.updateRoundMaxs();
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

  private updateRoundMaxs() {
    if (this.playerCount == 6) {
      this.roundMaxs = [2, 3, 4, 3, 4];
    } else if (this.playerCount == 7) {
      this.roundMaxs = [2, 3, 3, 4, 4];
    } else if (this.playerCount >= 8) {
      this.roundMaxs = [3, 4, 4, 5, 5];
    } else {
      this.roundMaxs = [2, 3, 2, 3, 3];
    }
  }
}
