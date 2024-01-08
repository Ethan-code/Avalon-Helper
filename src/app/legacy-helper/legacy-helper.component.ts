import {CommonModule} from "@angular/common";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import {formatISO} from "date-fns";
import {DateFnsModule} from "ngx-date-fns";
import {FileSaverModule, FileSaverService} from "ngx-filesaver";
import {
  CAMP_PLAYER_COUNT_SETTING,
  LakeResult,
  LakeStatus,
  Player,
  QUEST_PLAYER_COUNT_SETTING,
  Round,
  RoundResult,
  RoundStatus,
} from "./model";

@Component({
  selector: "app-legacy-helper",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileSaverModule, DateFnsModule],
  templateUrl: "./legacy-helper.component.html",
  styleUrl: "./legacy-helper.component.scss",
})
export class LegacyHelperComponent implements OnInit {
  public form!: FormGroup;

  private defaultPlayerCount = 5;
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

  private isFullscreen: boolean = false;

  public get playerCount(): number {
    return this.playerFormArray.length;
  }

  @ViewChild("fileInput") fileInput?: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder, private fileSaverService: FileSaverService) {}

  public ngOnInit(): void {
    this.form = this.initForm(this.defaultPlayerCount);
  }

  public onFullscreenClick(): void {
    if (!this.isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.isFullscreen = !this.isFullscreen;
  }

  public onImportClick(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files![0];
    if (!file) {
      return;
    }

    const checkInputAndSetFormValue = () => {
      const content: string | ArrayBuffer | null = reader.result;
      if (typeof content !== "string") {
        return;
      }

      const gameData = JSON.parse(content) as {
        players: Player[];
        rounds: Round[];
        lakeResults: LakeResult[];
        results: RoundResult[];
      };
      const playerCount = gameData.players.length;

      this.form = this.initForm(playerCount);
      setTimeout(() => {
        this.form.setValue(gameData);
      }, 0);
    };

    const reader = new FileReader();
    reader.onload = checkInputAndSetFormValue;
    reader.readAsText(file);
  }

  public onExportClick(): void {
    const jsonString = JSON.stringify(this.form.getRawValue());
    const blob = new Blob([jsonString], {type: "application/json"});
    const formattedDate = formatISO(new Date());
    this.fileSaverService.save(blob, `avalon-helper-${formattedDate}.json`);
  }

  public onAddClick(): void {
    if (this.playerCount < 10) {
      this.playerFormArray.controls.push(this.createPlayerControl());
      for (let i = 0; i < this.totalVoteCount; i++) {
        this.getVoteFormArray(i).controls.push(this.createVoteControl());
      }
    }

    // reset form value
    this.form = this.initForm(this.playerCount);
  }

  public onDeleteClick() {
    if (this.playerCount > 5) {
      this.playerFormArray.controls.pop();
      for (let i = 0; i < this.totalVoteCount; i++) {
        this.getVoteFormArray(i).controls.pop();
      }
    }

    // reset form value
    this.form = this.initForm(this.playerCount);
  }

  public onRoundClick(resultControl: AbstractControl, roundIndex: number): void {
    const currentResult: RoundStatus = resultControl.get("result")?.value;

    if (currentResult === RoundStatus.NotYet) {
      resultControl.patchValue({
        result: RoundStatus.Success,
      });
    } else if (currentResult === RoundStatus.Success) {
      resultControl.patchValue({
        result: RoundStatus.Failure,
        evilPlayerCount: 1,
      });
    } else if (currentResult === RoundStatus.Failure) {
      const evilPlayerCount = resultControl.get("evilPlayerCount")?.value;
      if (
        evilPlayerCount < CAMP_PLAYER_COUNT_SETTING[this.playerCount].evil &&
        evilPlayerCount < QUEST_PLAYER_COUNT_SETTING[this.playerCount][roundIndex + 1]
      ) {
        resultControl.patchValue({
          result: RoundStatus.Failure,
          evilPlayerCount: evilPlayerCount + 1,
        });
      } else {
        resultControl.patchValue({
          result: RoundStatus.NotYet,
          evilPlayerCount: 0,
        });
      }
    }
  }

  public onLakeClick(lakeResultControl: AbstractControl): void {
    const lakeResult = lakeResultControl.get("result")?.value;
    if (lakeResult === LakeStatus.NotYet) {
      lakeResultControl.patchValue({
        result: LakeStatus.Bad,
      });
    } else if (lakeResult === LakeStatus.Bad) {
      lakeResultControl.patchValue({
        result: LakeStatus.Good,
      });
    } else if (lakeResult === LakeStatus.Good) {
      lakeResultControl.patchValue({
        result: LakeStatus.NotYet,
      });
    }
  }

  public trackByFn(index: number, item: any): number {
    return index;
  }

  public getRoundResult(resultControl: AbstractControl): string {
    const result = resultControl.get("result")?.value;
    if (result === RoundStatus.Success) {
      return "left";
    } else if (result === RoundStatus.Failure) {
      return "right";
    } else {
      return "center";
    }
  }

  public getRoundTextColor(roundControl: AbstractControl): string {
    const result = roundControl.get("result")?.value;
    return result === RoundStatus.NotYet ? "navy" : "white";
  }

  public getBadCountsOrMax(qeustIndex: number): string {
    const roundControl = this.resultFormArray.at(qeustIndex);
    const result = roundControl.get("result")?.value;

    if (result === RoundStatus.Failure) {
      return roundControl.get("evilPlayerCount")?.value;
    } else if (result === RoundStatus.NotYet) {
      return QUEST_PLAYER_COUNT_SETTING[this.playerCount][qeustIndex + 1].toString();
    } else {
      return "";
    }
  }

  public getLakeResultPostion(lakeResultControl: AbstractControl): string {
    const lakeResult = lakeResultControl.get("result")?.value;
    if (lakeResult === LakeStatus.Good) {
      return "right";
    } else if (lakeResult === LakeStatus.Bad) {
      return "center";
    } else {
      return "left";
    }
  }

  public getVoteFormArray(index: number): FormArray {
    return this.roundFormArray.controls[index].get("votes") as FormArray;
  }

  private initForm(playerCount: number): FormGroup {
    const lakeResultCount = playerCount >= 7 ? 3 : 0;
    return this.formBuilder.group({
      players: this.formBuilder.array(this.createPlayerControls(playerCount)),
      rounds: this.formBuilder.array(this.createRoundControls(playerCount)),
      lakeResults: this.formBuilder.array(this.createLakeResultControls(lakeResultCount)),
      results: this.formBuilder.array(this.createResultControls()),
    });
  }

  // Multiple Controls
  private createPlayerControls(playerCount: number): FormGroup[] {
    return Array.from({length: playerCount}, () => this.createPlayerControl());
  }

  private createRoundControls(playerCount: number): FormGroup[] {
    return Array.from({length: this.totalVoteCount}, () => this.createRoundControl(playerCount));
  }

  private createLakeResultControls(lakeResultCount: number): FormGroup[] {
    return Array.from({length: lakeResultCount}, () => this.createLakeResultControl());
  }

  private createVoteControls(playerCount: number): FormGroup[] {
    return Array.from({length: playerCount}, () => this.createVoteControl());
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

  private createRoundControl(playerCount: number): FormGroup {
    return this.formBuilder.group({
      isPass: [false],
      votes: this.formBuilder.array(this.createVoteControls(playerCount)),
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
      result: [LakeStatus.NotYet],
    });
  }

  private createResultControl(): FormGroup {
    return this.formBuilder.group({
      result: [RoundStatus.NotYet],
      evilPlayerCount: 0,
    });
  }
}
