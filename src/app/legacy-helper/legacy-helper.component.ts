import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import {CAMP_PLAYER_COUNT_SETTING, Game, QUEST_PLAYER_COUNT_SETTING, RoundResult} from "./model";

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
  public get resultFormArray(): FormArray {
    return this.form.get("results") as FormArray;
  }

  get formJSON(): string {
    return JSON.stringify(this.form.getRawValue());
  }

  private isFullscreen: boolean = false;

  public lakeResults = [LakeResultEnum.NotYet, LakeResultEnum.NotYet, LakeResultEnum.NotYet];
  public get showlakeLogics(): boolean[] {
    return [
      this.playerCount < 7,
      this.playerCount < 7 || this.lakeResults[0] === "NotYet",
      this.playerCount < 7 || this.lakeResults[0] === "NotYet" || this.lakeResults[1] === "NotYet",
    ];
  }

  public get playerCount(): number {
    return this.playerFormArray.length;
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
      this.playerFormArray.controls.push(this.createPlayerControl());
      for (let i = 0; i < this.totalVoteCount; i++) {
        this.getVoteFormArray(i).controls.push(this.createVoteControl());
      }
    }
  }

  public onDeleteClick() {
    if (this.playerCount > 5) {
      this.playerFormArray.controls.pop();
      for (let i = 0; i < this.totalVoteCount; i++) {
        this.getVoteFormArray(i).controls.pop();
      }
    }
  }

  public trackByFn(index: number, item: any) {
    return index;
  }

  public onRoundClick(resultControl: AbstractControl) {
    const currentResult: RoundResult = resultControl.get("result")?.value;

    if (currentResult === RoundResult.NotYet) {
      resultControl.patchValue({
        result: RoundResult.Success,
      });
    } else if (currentResult === RoundResult.Success) {
      resultControl.patchValue({
        result: RoundResult.Failure,
        evilPlayerCount: 1,
      });
    } else if (currentResult === RoundResult.Failure) {
      const evilPlayerCount = resultControl.get("evilPlayerCount")?.value;
      if (evilPlayerCount < CAMP_PLAYER_COUNT_SETTING[this.playerCount].evil) {
        resultControl.patchValue({
          result: RoundResult.Failure,
          evilPlayerCount: evilPlayerCount + 1,
        });
      } else {
        resultControl.patchValue({
          result: RoundResult.NotYet,
          evilPlayerCount: 0,
        });
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

  public getRoundResult(resultControl: AbstractControl) {
    const result = resultControl.get("result")?.value;
    if (result === RoundResult.Success) {
      return "left";
    } else if (result === RoundResult.Failure) {
      return "right";
    } else {
      return "center";
    }
  }

  public getRoundTextColor(roundControl: AbstractControl) {
    const result = roundControl.get("result")?.value;
    return result === RoundResult.NotYet ? "navy" : "white";
  }

  public getBadCountsOrMax(qeustIndex: number): string {
    const roundControl = this.resultFormArray.at(qeustIndex);
    const result = roundControl.get("result")?.value;

    if (result === RoundResult.Failure) {
      return roundControl.get("evilPlayerCount")?.value;
    } else if (result === RoundResult.NotYet) {
      return QUEST_PLAYER_COUNT_SETTING[this.playerCount][qeustIndex + 1].toString();
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
      result: ["NotYet"],
      evilPlayerCount: 0,
    });
  }

  private initGame(totalPlayerCount: number): Game {
    return new Game(totalPlayerCount);
  }
}
