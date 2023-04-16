import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import Chart from 'chart.js/auto';
import { catchError, combineLatest, forkJoin, map, merge, take } from 'rxjs';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
})
export class HomePage implements AfterViewInit, OnInit {
  spotifyToken?: string  | null;
  @ViewChild('congresoCanvas') private congresoCanvas?: ElementRef;
  congresoChart: any;
  artists: any[] = [];
  constructor(private spotify: SpotifyService, private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    const localToken = localStorage.getItem('electify-token');
    if (localToken) {
      this.spotifyToken = localToken;
    } else {
      this.route.fragment.pipe(
        take(1)
      )
      .subscribe(fragment => {
        const spotifyToken = new URLSearchParams(fragment || '').get('access_token');
        localStorage.setItem('electify-token', spotifyToken || '');
        this.router.navigate(['']);
      })
    }
  }
  ngAfterViewInit(): void {
    if (this.spotifyToken) {
      this.spotify.getTopArtists(this.spotifyToken)
      .pipe(
        map(r => forkJoin(r)),
        catchError(e => {
          this.requestAccess()
          throw e;
        })
      )
      .subscribe(res => {
        res.subscribe(artists => {
          this.artists = artists;
          this.applyDhont();
        });
      });
    }
  }

  loadCongreso() {
    this.congresoChart = new Chart(this.congresoCanvas?.nativeElement, {
      type: 'doughnut',
      options: {
        circumference: 180,
        rotation: -90,
        plugins: {
          legend: {
            position: 'bottom'
          },
        }
      },
      data: {
        labels: this.artists?.map(a => `${a.name} (${a.seats})`),
        datasets: [{
          label: 'Escaños',
          data: this.artists?.map(a => a.seats),
        }],
      }
    });
  }

  requestAccess() {
    this.spotify.requestAccess();
  }

  private applyDhont() {
    this.artists.forEach(a => a.seats = 0);
    let numberOfSeat = 1;
    const coefficients = [];
    let partialVotes: any[] = [];
    while (numberOfSeat <= 350) {
      const iteration = this.artists.map(a => ({name: a.name, coefficient: Math.floor(a.partialVotes/numberOfSeat)}));
      partialVotes.push(iteration);
      numberOfSeat++;
    }
    const ordered = partialVotes.flat().sort((a, b) => b.coefficient - a.coefficient).slice(0, 350);
    this.artists = this.artists.map(a => {
      a.seats = ordered.filter(o => o.name === a.name).length;
      return a;
    });
    this.artists = this.artists.sort((a, b) => b.seats - a.seats).slice(0,5);
    console.log('Escaños', this.artists);
    this.loadCongreso();
  }
}
