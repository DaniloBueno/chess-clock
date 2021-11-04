import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {timer} from 'rxjs';
import * as dayjs from 'dayjs';
import {Constants} from '../../constants';

@Component({
    selector: 'app-player-timer',
    templateUrl: './player-timer.component.html',
    styleUrls: ['./player-timer.component.css']
})
export class PlayerTimerComponent implements OnInit {
    @Input()
    player;

    @Input()
    totalTime;

    @Input()
    increment;

    @Output()
    startOtherPlayerTimerEvent = new EventEmitter<string>();

    @Output()
    endgameEvent = new EventEmitter<string>();

    interval = Constants.DEFAULT_INTERVAL;
    timer = null;
    subscription = null;
    currentTime;

    finishedTime = false;
    focusClock = false;
    disableClock = false;

    ngOnInit() {
        this.currentTime = dayjs().minute(this.totalTime).second(0);
    }

    start() {
        if (!this.timer) {
            this.timer = timer(this.interval, this.interval);
            this.subscription = this.timer
                .subscribe(() => {
                    if (this.currentTime.minute() === 0 && this.currentTime.second() === 0) {
                        this.subscription.unsubscribe();
                        this.endgameEvent.emit(this.player);
                    } else {
                        this.currentTime = this.currentTime.subtract(1, 'second');
                    }
                });
        }
    }

    stop() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.timer = null;
        }
    }

    reset() {
        this.stop();
        this.currentTime = dayjs().minute(this.totalTime).second(0);
    }

    setValues(totalTime: number, increment: number) {
        this.totalTime = totalTime;
        this.increment = increment;
    }

    startOtherPlayerTimer() {
        if (this.increment > 0) {
            this.currentTime = this.currentTime.add(this.increment, 'second');
        }
        this.startOtherPlayerTimerEvent.emit(this.player);
    }
}
