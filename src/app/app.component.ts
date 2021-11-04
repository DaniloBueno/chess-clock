import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {PlayerTimerComponent} from './player-timer/player-timer.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../constants';

declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    @ViewChild('player1', {static: false}) player1Timer: PlayerTimerComponent;
    @ViewChild('player2', {static: false}) player2Timer: PlayerTimerComponent;

    totalTime = Constants.DEFAULT_TOTAL_TIME;
    increment = Constants.DEFAULT_INCREMENT;
    player1 = Constants.PLAYER_1;
    player2 = Constants.PLAYER_2;

    audio = new Audio();
    muteAudio = false;

    settingsForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.settingsForm = this.formBuilder.group({
            totalTime: [this.totalTime, [Validators.required, Validators.min(1), Validators.max(60)]],
            increment: [this.increment, [Validators.required, Validators.min(0), Validators.max(30)]]
        });

        this.audio.src = '../assets/tick.mp3';
        this.audio.load();

        $('[data-toggle="tooltip"]').tooltip(); // enables bootstrap tooltip
    }

    onStartOtherPlayerTimer(player: string) {
        if (!this.muteAudio) {
            this.audio.play().catch();
        }

        if (player === this.player1) {
            this.player1Timer.focusClock = false;
            this.player2Timer.focusClock = true;

            this.player1Timer.disableClock = true;
            this.player2Timer.disableClock = false;

            this.player2Timer.start();
            this.player1Timer.stop();
        } else if (player === this.player2) {
            this.player1Timer.focusClock = true;
            this.player2Timer.focusClock = false;

            this.player1Timer.disableClock = false;
            this.player2Timer.disableClock = true;

            this.player1Timer.start();
            this.player2Timer.stop();
        }
    }

    onEndgameEvent(player: string) {
        if (player === this.player1) {
            this.player1Timer.disableClock = true;
            this.player1Timer.finishedTime = true;
        } else if (player === this.player2) {
            this.player2Timer.disableClock = true;
            this.player2Timer.finishedTime = true;
        }
    }

    resetTimers() {
        this.player1Timer.focusClock = false;
        this.player2Timer.focusClock = false;

        this.player1Timer.disableClock = false;
        this.player2Timer.disableClock = false;

        this.player1Timer.finishedTime = false;
        this.player2Timer.finishedTime = false;

        this.player1Timer.reset();
        this.player2Timer.reset();
    }

    saveSettings() {
        this.player1Timer.setValues(this.settingsForm.value.totalTime, this.settingsForm.value.increment);
        this.player2Timer.setValues(this.settingsForm.value.totalTime, this.settingsForm.value.increment);
        this.resetTimers();
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        const key = event.key;

        if (key === Constants.KEY_ENTER) {
            if (!this.player1Timer.finishedTime && !this.player2Timer.finishedTime) {
                this.onStartOtherPlayerTimer(this.player1Timer.focusClock ? Constants.PLAYER_1 : Constants.PLAYER_2);
            }
        }

        if (key === Constants.KEY_BACKSPACE) {
            this.resetTimers();
        }
    }
}
