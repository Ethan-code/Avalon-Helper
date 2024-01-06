import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {Game} from "./model";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

interface RoundResult {
  badCounts: number;
  result: RoundResultEnum;
}

enum RoundResultEnum {
  NotYet = "NotYet",
  Success = "Success",
  Failure = "Failure",
  NoPlay = "NoPlay",
}

enum LakeResultEnum {
  NotYet = "NotYet",
  Good = "Good",
  Bad = "Bad",
}

@Component({
  selector: "app-legacy-helper",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./legacy-helper.component.html",
  styleUrl: "./legacy-helper.component.scss",
})
export class LegacyHelperComponent implements OnInit {
  public form!: FormGroup;

  public game!: Game;
  private defaultPlayerCount = 5;
  private totalVoteCount = 25;

  public get playerFormArray(): FormArray {
    return this.form.get("players") as FormArray;
  }

  public get roundFormArray(): FormArray {
    return this.form.get("rounds") as FormArray;
  }

  get formJSON(): string {
    return JSON.stringify(this.form.getRawValue());
  }

  private isFullscreen: boolean = false;

  public roundMaxs = [2, 3, 2, 3, 3];

  public lakeResults = [LakeResultEnum.NotYet, LakeResultEnum.NotYet, LakeResultEnum.NotYet];
  public get showlakeLogics(): boolean[] {
    return [
      this.playerCount < 7,
      this.playerCount < 7 || this.lakeResults[0] === "NotYet",
      this.playerCount < 7 || this.lakeResults[0] === "NotYet" || this.lakeResults[1] === "NotYet",
    ];
  }

  public roundResults: RoundResult[] = [
    {
      badCounts: 0,
      result: RoundResultEnum.NotYet,
    },
    {
      badCounts: 0,
      result: RoundResultEnum.NotYet,
    },
    {
      badCounts: 0,
      result: RoundResultEnum.NotYet,
    },
    {
      badCounts: 0,
      result: RoundResultEnum.NotYet,
    },
    {
      badCounts: 0,
      result: RoundResultEnum.NotYet,
    },
  ];

  public playerCount = 5;
  public get playerCounts(): number[] {
    return Array.from({length: this.playerCount}, (_, index) => index + 1);
  }
  public voteCount = 25;
  public get voteCounts(): number[] {
    return Array.from({length: this.voteCount}, (_, index) => index + 1);
  }

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.form = this.initForm();
    this.game = this.initGame(this.defaultPlayerCount);

    this.playerFormArray.controls[0].get("");
  }

  public onSubmit(): void {}

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
      this.playerFormArray.controls.push(this.createPlayerControl());
      for (let i = 0; i < this.totalVoteCount; i++) {
        this.getVoteFormArray(i).controls.push(this.createVoteControl());
      }
    }
    this.updateRoundMaxs();
  }

  public onDeleteClick() {
    if (this.playerCount > 5) {
      this.playerCount--;
      this.playerFormArray.controls.pop();
      for (let i = 0; i < this.totalVoteCount; i++) {
        this.getVoteFormArray(i).controls.pop();
      }
    }
    this.updateRoundMaxs();
  }

  public trackByFn(index: number, item: any) {
    return index;
  }

  public onRoundClick(roundResult: RoundResult, index: number) {
    if (roundResult.result === RoundResultEnum.NotYet) {
      this.roundResults[index] = {
        result: RoundResultEnum.Success,
        badCounts: 0,
      };
    } else if (roundResult.result === RoundResultEnum.Success) {
      this.roundResults[index] = {
        result: RoundResultEnum.Failure,
        badCounts: 1,
      };
    } else if (roundResult.result === RoundResultEnum.Failure) {
      let badCounts = this.roundResults[index].badCounts;
      if (badCounts < this.roundMaxs[index]) {
        this.roundResults[index] = {
          result: RoundResultEnum.Failure,
          badCounts: badCounts + 1,
        };
      } else {
        this.roundResults[index] = {
          result: RoundResultEnum.NotYet,
          badCounts: 0,
        };
      }
    }
  }

  public onLakeClick(lakeResult: LakeResultEnum, index: number) {
    if (lakeResult === LakeResultEnum.NotYet) {
      this.lakeResults[index] = LakeResultEnum.Bad;
    } else if (lakeResult === LakeResultEnum.Bad) {
      this.lakeResults[index] = LakeResultEnum.Good;
    } else if (lakeResult === LakeResultEnum.Good) {
      this.lakeResults[index] = LakeResultEnum.NotYet;
    }
  }

  public getRoundResult(roundResult: RoundResult) {
    if (roundResult.result === RoundResultEnum.Success) {
      return "left";
    } else if (roundResult.result === RoundResultEnum.Failure) {
      return "right";
    } else {
      return "center";
    }
  }

  public getRoundTextColor(roundResult: RoundResult) {
    return roundResult.result === "NotYet" ? "navy" : "white";
  }

  public getBadCountsOrMax(index: number) {
    const roundResult = this.roundResults[index];
    if (roundResult.result === RoundResultEnum.Failure) {
      return roundResult.badCounts;
    } else if (roundResult.result === RoundResultEnum.NotYet) {
      return this.roundMaxs[index];
    } else {
      return "";
    }
  }

  public getLakeResult(lakeResult: LakeResultEnum) {
    if (lakeResult === LakeResultEnum.Good) {
      return "right";
    } else if (lakeResult === LakeResultEnum.Bad) {
      return "center";
    } else {
      return "left";
    }
  }

  public getVoteFormArray(index: number): FormArray {
    return this.roundFormArray.controls[index].get("votes") as FormArray;
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

  private initForm(): FormGroup {
    const playerControls = Array.from({length: this.defaultPlayerCount}, () =>
      this.createPlayerControl(),
    );
    const roundControls = Array.from({length: this.totalVoteCount}, () =>
      this.createRoundControl(),
    );
    const resultControls = Array.from({length: 5}, () => this.createResultControl());

    return this.formBuilder.group({
      players: this.formBuilder.array(playerControls),
      rounds: this.formBuilder.array(roundControls),
      results: this.formBuilder.array(resultControls),
    });
  }

  private createPlayerControl(): FormGroup {
    return this.formBuilder.group({
      name: [""],
    });
  }

  private createRoundControl(): FormGroup {
    const voteControls = Array.from({length: this.defaultPlayerCount}, (_, index) =>
      this.createVoteControl(),
    );

    return this.formBuilder.group({
      isPass: [false],
      votes: this.formBuilder.array(voteControls),
    });
  }

  private createVoteControl(): FormGroup {
    return this.formBuilder.group({
      vote: [false],
      isMember: [false],
    });
  }

  private createResultControl(): FormGroup {
    return this.formBuilder.group({
      result: [null],
    });
  }

  private initGame(totalPlayerCount: number): Game {
    return new Game(totalPlayerCount);
  }
}
