import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  CAMP_PLAYER_COUNT_SETTING,
  LakeResult,
  QUEST_PLAYER_COUNT_SETTING,
  RoundResult,
} from "./model";

@Component({
  selector: "app-legacy-helper",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./legacy-helper.component.html",
  styleUrl: "./legacy-helper.component.scss",
})
export class LegacyHelperComponent implements OnInit {
  public form!: FormGroup;

  private defaultPlayerCount = 5;
  private defulatLakeCount = 0;
  private totalRoundCount = 5;
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
  public get lakeResultFormArray(): FormArray {
    return this.form.get("lakeResults") as FormArray;
  }

  get formJSON(): string {
    return JSON.stringify(this.form.getRawValue());
  }

  private isFullscreen: boolean = false;

  public get showlakeLogics(): boolean[] {
    const lakeResult1 = this.lakeResultFormArray.controls[0].get("result")?.value;
    const lakeResult2 = this.lakeResultFormArray.controls[1].get("result")?.value;
    return [
      this.playerCount < 7,
      this.playerCount < 7 || lakeResult1 === "NotYet",
      this.playerCount < 7 || lakeResult1 === "NotYet" || lakeResult2 === "NotYet",
    ];
  }

  public get playerCount(): number {
    return this.playerFormArray.length;
  }

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.form = this.initForm();
  }

  public onFullscreenClick(): void {
    if (!this.isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.isFullscreen = !this.isFullscreen;
  }

  public onAddClick(): void {
    if (this.playerCount < 10) {
      this.playerFormArray.controls.push(this.createPlayerControl());
      for (let i = 0; i < this.totalVoteCount; i++) {
        this.getVoteFormArray(i).controls.push(this.createVoteControl());
      }
    }

    if (this.playerCount >= 7) {
      this.lakeResultFormArray.controls.push(this.createLakeResultControl());
    } else {
      this.lakeResultFormArray.clear();
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

  public onRoundClick(resultControl: AbstractControl): void {
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

  public onLakeClick(lakeResultControl: AbstractControl): void {
    const lakeResult = lakeResultControl.get("result")?.value;
    if (lakeResult === LakeResult.NotYet) {
      lakeResultControl.patchValue({
        result: LakeResult.Bad,
      });
      this.lakeResultFormArray.controls.push(this.createLakeResultControl());
    } else if (lakeResult === LakeResult.Bad) {
      lakeResultControl.patchValue({
        result: LakeResult.Good,
      });
    } else if (lakeResult === LakeResult.Good) {
      lakeResultControl.patchValue({
        result: LakeResult.NotYet,
      });
      this.lakeResultFormArray.controls.pop();
    }
  }

  public trackByFn(index: number, item: any): number {
    return index;
  }

  public getRoundResult(resultControl: AbstractControl): string {
    const result = resultControl.get("result")?.value;
    if (result === RoundResult.Success) {
      return "left";
    } else if (result === RoundResult.Failure) {
      return "right";
    } else {
      return "center";
    }
  }

  public getRoundTextColor(roundControl: AbstractControl): string {
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

  public getLakeResultPostion(lakeResultControl: AbstractControl): string {
    const lakeResult = lakeResultControl.get("result")?.value;
    if (lakeResult === LakeResult.Good) {
      return "right";
    } else if (lakeResult === LakeResult.Bad) {
      return "center";
    } else {
      return "left";
    }
  }

  public getVoteFormArray(index: number): FormArray {
    return this.roundFormArray.controls[index].get("votes") as FormArray;
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      players: this.formBuilder.array(this.createPlayerControls()),
      rounds: this.formBuilder.array(this.createRoundControls()),
      lakeResults: this.formBuilder.array([]),
      results: this.formBuilder.array(this.createResultControls()),
    });
  }

  // Multiple Controls
  private createPlayerControls(): FormGroup[] {
    return Array.from({length: this.defaultPlayerCount}, () => this.createPlayerControl());
  }

  private createRoundControls(): FormGroup[] {
    return Array.from({length: this.totalVoteCount}, () => this.createRoundControl());
  }

  private createVoteControls(): FormGroup[] {
    return Array.from({length: this.defaultPlayerCount}, () => this.createVoteControl());
  }

  private createResultControls(): FormGroup[] {
    return Array.from({length: this.totalRoundCount}, () => this.createResultControl());
  }

  // Single Control
  private createPlayerControl(): FormGroup {
    return this.formBuilder.group({
      name: [""],
    });
  }

  private createRoundControl(): FormGroup {
    return this.formBuilder.group({
      isPass: [false],
      votes: this.formBuilder.array(this.createVoteControls()),
    });
  }

  private createVoteControl(): FormGroup {
    return this.formBuilder.group({
      vote: [false],
      isMember: [false],
    });
  }

  private createLakeResultControl(): FormGroup {
    return this.formBuilder.group({
      targetPlayerIndex: null,
      result: [LakeResult.NotYet],
    });
  }

  private createResultControl(): FormGroup {
    return this.formBuilder.group({
      result: [RoundResult.NotYet],
      evilPlayerCount: 0,
    });
  }
}
