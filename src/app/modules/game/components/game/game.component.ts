import { IfStmt } from '@angular/compiler';
import { Component, OnInit, SystemJsNgModuleLoader, SystemJsNgModuleLoaderConfig } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { enemyModel } from '../../../../../models/enemyModel';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less'],
  providers: [DataService]
})
export class GameComponent implements OnInit {
  secondStyle: string = "black-point-secondary"
  isBlack = true;
  blackValues:boolean[][]=[];
  borderSub: Subscription = new Subscription;
  createSub: Subscription = new Subscription;
  checkSub: Subscription = new Subscription;
  movingSub: Subscription = new Subscription;
  checkSubEvent: Subscription = new Subscription;
  sendSub: Subscription = new Subscription;
  scoreSub: Subscription = new Subscription;
  goingRow: boolean = false;
  barrelPoint: any;
  bgMusic:any;
  enemyList: enemyModel[] = [];
  maxValue:number = 20;
  level: number=0;
  score: number = 0;
  pressAudio = new Audio("../../../../../assets/audio/btn.mp3");
  constructor(public dataService: DataService) { }
  ngOnInit(): void {
    this.blackValues = this.createNewMatrix();
    for(var i=0;i<this.maxValue;i++)
        {
          if(i%4==3)
          {
            this.blackValues[i][0] = false;
            this.blackValues[i][9] = false;
          }
          else
          {
            this.blackValues[i][0]=true;
            this.blackValues[i][9]=true;
          }
        }
  }
  toggle(): void {
    this.score = 0;
    this.bgMusic = new Audio("../../../../../assets/audio/audio.mp3");
    this.bgMusic.load();
    this.bgMusic.play();
    this.blackValues[this.maxValue-1][4] = true;
    this.blackValues[this.maxValue-1][6] = true;
    this.blackValues[this.maxValue-2][5] = true;
    this.blackValues[this.maxValue-3][4] = true;
    this.blackValues[this.maxValue-3][6] = true;
    this.blackValues[this.maxValue-4][5] = true;
    this.barrelPoint = 5;
    this.sendSub = fromEvent(document,"keydown").subscribe(next => this.sendButton(next));
    this.checkSubEvent = fromEvent(document,"keydown").subscribe(next => this.checkLose());

    const timer = new Observable(observer => {
      var counter = 500;
      var myFunction = function(){
        clearInterval(interval);
        counter -= 1;
        observer.next(counter);
        interval = setInterval(myFunction, counter);

      }
      var interval = setInterval(myFunction, counter);
    });
    
    this.borderSub = timer.subscribe(next => this.border(next as number));
    this.createSub = timer.subscribe(next => this.createEnemy(next as number))
    this.movingSub = timer.subscribe(next => this.enemyMoving());
    this.checkSub = timer.subscribe(next => this.checkLose());
    this.scoreSub = timer.subscribe(next =>this.scoreCounter());
  }
    border(value: number): void {
      switch(value%4){
        case 0:
          for(var i=0;i<this.maxValue;i++)
          {
            if(i%4==3)
            {
              this.blackValues[i][0] = false;
              this.blackValues[i][9] = false;
            }
            else
            {
              this.blackValues[i][0]=true;
              this.blackValues[i][9]=true;
            }
          }
          break;
        case 1: 
          for(var i=0;i<this.maxValue;i++)
          {
            if(i%4==0)
            {
              this.blackValues[i][0] = false;
              this.blackValues[i][9] = false;
            }
            else
            {
              this.blackValues[i][0]=true;
              this.blackValues[i][9]=true;
            }
          }
          break;
        case 2:
          for(var i=0;i<this.maxValue;i++)
          {
            if(i%4==1)
            {
              this.blackValues[i][0] = false;
              this.blackValues[i][9] = false;
            }
            else
            {
              this.blackValues[i][0]=true;
              this.blackValues[i][9]=true;
            }
          }
          break;
        case 3:
          for(var i=0;i<this.maxValue;i++)
          {
            if(i%4==2)
            {
              this.blackValues[i][0] = false;
              this.blackValues[i][9] = false;
            }
            else
            {
              this.blackValues[i][0]=true;
              this.blackValues[i][9]=true;
            }
          }
          break;
    }
  }
  scoreCounter(){
    this.score++;
    this.level = Math.floor(this.score/100);
  }
  checkLose() {
    let lose = false;
    let enemy = this.enemyList[0];
    if(enemy!=null){
    if(enemy.head==17 && enemy.column==this.barrelPoint)
      {
        lose = true;
        this.gameOver();        
      }
    if(enemy.head==18 && (enemy.column == this.barrelPoint-1 || enemy.column == this.barrelPoint+1))
    {
        lose = true;
        this.gameOver();        
    }
    if(enemy.head>=19 && (enemy.column == this.barrelPoint-2 || enemy.column == this.barrelPoint+2))
    {
        lose = true;
        this.gameOver();        
    }}
  }
  gameOver(){
    this.blackValues = this.createNewMatrix();
    this.checkSub.unsubscribe();
    this.borderSub.unsubscribe();
    this.movingSub.unsubscribe();
    this.createSub.unsubscribe();
    this.checkSubEvent.unsubscribe();
    this.scoreSub.unsubscribe();
    this.sendSub.unsubscribe();
    this.enemyList = [];
    this.bgMusic.pause();
    if(this.score > this.dataService.getData())
    {
      this.dataService.setData(this.score);
      this.bgMusic = new Audio("../../../../../assets/audio/newrecord.mp3");
    }
    else
    {
      this.bgMusic = new Audio("../../../../../assets/audio/lose.mp3");
    }
  this.bgMusic.load();
    this.bgMusic.play();
  }
  sendButton(value:any){
    value = value as KeyboardEvent;
    if(value.keyCode == 37)
      {
        this.pressAudio.play();
        if(this.barrelPoint!=2)
      {
        this.blackValues[this.maxValue-1][this.barrelPoint-1] = false;
        this.blackValues[this.maxValue-1][this.barrelPoint+1] = false;
        this.blackValues[this.maxValue-2][this.barrelPoint] = false;
        this.blackValues[this.maxValue-3][this.barrelPoint-1] = false;
        this.blackValues[this.maxValue-3][this.barrelPoint+1] = false;
        this.blackValues[this.maxValue-4][this.barrelPoint] = false;

        this.blackValues[19][this.barrelPoint-2] = true;
        this.blackValues[19][this.barrelPoint] = true;
        this.blackValues[18][this.barrelPoint-1] = true;
        this.blackValues[17][this.barrelPoint-2] = true;
        this.blackValues[17][this.barrelPoint] = true;
        this.blackValues[16][this.barrelPoint-1] = true;
        this.barrelPoint = this.barrelPoint-1;
      }
    }
    else if(value.keyCode == 39)
    {
      this.pressAudio.play();
      if(this.barrelPoint!=7)
      {
        this.blackValues[19][this.barrelPoint-1] = false;
        this.blackValues[19][this.barrelPoint+1] = false;
        this.blackValues[18][this.barrelPoint] = false;
        this.blackValues[17][this.barrelPoint-1] = false;
        this.blackValues[17][this.barrelPoint+1] = false;
        this.blackValues[16][this.barrelPoint] = false;
        this.blackValues[19][this.barrelPoint] = true;
        this.blackValues[19][this.barrelPoint+2] = true;
        this.blackValues[18][this.barrelPoint+1] = true;
        this.blackValues[17][this.barrelPoint] = true;
        this.blackValues[17][this.barrelPoint+2] = true;
        this.blackValues[16][this.barrelPoint+1] = true;
        this.barrelPoint = this.barrelPoint+1;
      }
    }
  }
  createNewMatrix(){
      let arrayInit: boolean[][] = [];
      for(let i: number=0; i<this.maxValue; i++){
          arrayInit[i]=[];
          for(let j: number=0; j<10; j++){
              arrayInit[i][j]=false;
          }
      }
      return arrayInit;
  }
  createEnemy(value:number){
   if(value%11==0)
    {
          let x = this.getRandomArbitrary(2,7);
          this.enemyList.push(new enemyModel(x));
    }
  }
  getRandomArbitrary(min:number,max:number): number {
    return Math.floor(Math.random() * (max+1 - min)) + min;
  }
  enemyMoving()
  {
      for(var i = this.enemyList.length-1;i>=0;i--)
      {
        this.showEnemy(this.enemyList[i]);
      }
  }
  showEnemy (enemy:enemyModel) {
    switch(enemy.head)
    {
      case 0:
        this.blackValues[enemy.head][enemy.column] = true;
        break;
      case 1:
        this.blackValues[enemy.head-1][enemy.column] = false;
        this.blackValues[enemy.head][enemy.column] = true;
        this.blackValues[enemy.head-1][enemy.column+1] = true;
        this.blackValues[enemy.head-1][enemy.column-1] = true;
        break;
      case 2:
        this.blackValues[enemy.head-1][enemy.column] = false;
        this.blackValues[enemy.head][enemy.column] = true;
        this.blackValues[enemy.head-1][enemy.column+1] = true;
        this.blackValues[enemy.head-1][enemy.column-1] = true;
        this.blackValues[enemy.head-2][enemy.column+1] = false;
        this.blackValues[enemy.head-2][enemy.column-1] = false;
        this.blackValues[enemy.head-2][enemy.column] = true;
        break;
      case 3:
        this.blackValues[enemy.head-1][enemy.column] = false;
        this.blackValues[enemy.head][enemy.column] = true;
        this.blackValues[enemy.head-1][enemy.column+1] = true;
        this.blackValues[enemy.head-1][enemy.column-1] = true;
        this.blackValues[enemy.head-2][enemy.column+1] = false;
        this.blackValues[enemy.head-2][enemy.column-1] = false;
        this.blackValues[enemy.head-2][enemy.column] = true;
        this.blackValues[enemy.head-3][enemy.column-1]=true;
        this.blackValues[enemy.head-3][enemy.column+1]=true;
        this.blackValues[enemy.head-3][enemy.column]=false;
        break;
      case this.maxValue:
        this.blackValues[enemy.head-1][enemy.column] = false;
        this.blackValues[enemy.head-1][enemy.column+1] = true;
        this.blackValues[enemy.head-1][enemy.column-1] = true;
        this.blackValues[enemy.head-2][enemy.column+1] = false;
        this.blackValues[enemy.head-2][enemy.column-1] = false;
        this.blackValues[enemy.head-2][enemy.column] = true;
        this.blackValues[enemy.head-3][enemy.column-1]=true;
        this.blackValues[enemy.head-3][enemy.column+1]=true;
        this.blackValues[enemy.head-3][enemy.column]=false;
        this.blackValues[enemy.head-4][enemy.column+1] = false;
        this.blackValues[enemy.head-4][enemy.column-1] = false;
        break;
      case this.maxValue+1:
        this.blackValues[enemy.head-2][enemy.column+1] = false;
        this.blackValues[enemy.head-2][enemy.column-1] = false;
        this.blackValues[enemy.head-2][enemy.column] = true;
        this.blackValues[enemy.head-3][enemy.column-1]=true;
        this.blackValues[enemy.head-3][enemy.column+1]=true;
        this.blackValues[enemy.head-3][enemy.column]=false;
        this.blackValues[enemy.head-4][enemy.column+1] = false;
        this.blackValues[enemy.head-4][enemy.column-1] = false;
        break;
      case this.maxValue+2:
        this.blackValues[enemy.head-3][enemy.column-1]=true;
        this.blackValues[enemy.head-3][enemy.column+1]=true;
        this.blackValues[enemy.head-3][enemy.column]=false;
        this.blackValues[enemy.head-4][enemy.column+1] = false;
        this.blackValues[enemy.head-4][enemy.column-1] = false;
        break;
      case this.maxValue+3:
        this.blackValues[enemy.head-4][enemy.column+1] = false;
        this.blackValues[enemy.head-4][enemy.column-1] = false;
        break;
      default:
        this.blackValues[enemy.head-1][enemy.column] = false;
        this.blackValues[enemy.head][enemy.column] = true;
        this.blackValues[enemy.head-1][enemy.column+1] = true;
        this.blackValues[enemy.head-1][enemy.column-1] = true;
        this.blackValues[enemy.head-2][enemy.column+1] = false;
        this.blackValues[enemy.head-2][enemy.column-1] = false;
        this.blackValues[enemy.head-2][enemy.column] = true;
        this.blackValues[enemy.head-3][enemy.column-1]=true;
        this.blackValues[enemy.head-3][enemy.column+1]=true;
        this.blackValues[enemy.head-3][enemy.column]=false;
        this.blackValues[enemy.head-4][enemy.column+1] = false;
        this.blackValues[enemy.head-4][enemy.column-1] = false;
        break;
      }
      if(enemy.head<this.maxValue+3)
        enemy.head = enemy.head+1;
      else
        {
          this.enemyList.shift();
        } 
  }
}