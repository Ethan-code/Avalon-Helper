// TODO: class 加入 id 進行識別

export class Player {
  name: string;
  position: number;

  constructor(name: string, position: number) {
    this.name = name;
    this.position = position;
  }
}

export class Game {
  players: Player[];
  totalPlayerCount: number;

  get goodPlayerCount(): number {
    return CAMP_PLAYER_COUNT_SETTING[this.totalPlayerCount + 1].good;
  }

  get evilPlayerCount(): number {
    return CAMP_PLAYER_COUNT_SETTING[this.totalPlayerCount + 1].evil;
  }

  constructor(totalPlayerCount: number) {
    this.players = this.initPlayers(totalPlayerCount);
    this.totalPlayerCount = totalPlayerCount;
  }

  private initPlayers(playerCount: number): Player[] {
    return Array.from({length: playerCount}, (_, index) => new Player("", index));
  }
}

export class Quest {
  order: number;
  allowedCardCount: number;
  questCards: QuestCard[];

  constructor(order: number, allowedCardCount: number, questCards: QuestCard[]) {
    this.order = order;
    this.allowedCardCount = allowedCardCount;
    this.questCards = questCards;
  }
}

export class QuestCard {
  status: QuestStatus;
  player: Player | null;

  constructor(status: QuestStatus, player: Player) {
    this.status = status;
    this.player = player;
  }
}

enum QuestStatus {
  Success = "Success",
  Failure = "Failure",
}

// 好壞陣營 (Camp) 人員數量
export const CAMP_PLAYER_COUNT_SETTING: {
  [playerCount: number]: {
    good: number;
    evil: number;
  };
} = {
  5: {
    good: 3,
    evil: 2,
  },
  6: {
    good: 4,
    evil: 2,
  },
  7: {
    good: 4,
    evil: 3,
  },
  8: {
    good: 5,
    evil: 3,
  },
  9: {
    good: 6,
    evil: 3,
  },
  10: {
    good: 6,
    evil: 4,
  },
};

// 任務 (Quest) 人員數量
export const QUEST_PLAYER_COUNT_SETTING: {
  [playerCount: number]: {
    [questOrder: number]: number;
  };
} = {
  5: {
    1: 2,
    2: 3,
    3: 2,
    4: 3,
    5: 3,
  },
  6: {
    1: 2,
    2: 3,
    3: 4,
    4: 3,
    5: 4,
  },
  7: {
    1: 2,
    2: 3,
    3: 3,
    4: 4,
    5: 4,
  },
  8: {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5,
  },
  9: {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5,
  },
  10: {
    1: 3,
    2: 4,
    3: 4,
    4: 5,
    5: 5,
  },
};

export enum RoundResult {
  NotYet = "NotYet",
  Success = "Success",
  Failure = "Failure",
  NoPlay = "NoPlay",
}
