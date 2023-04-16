import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) {}

  requestAccess() {
    const scope = 'user-top-read';
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(environment.spotifyClientID);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(environment.spotifyRedirectURL);
    window.location.href = url;
  }

  getTopArtists(spotifyToken: string) {
    return this.http.get(`https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=20`, {
      headers: {
        'Authorization': `Bearer ${spotifyToken}`
      }
    })
    .pipe(
      take(1),
      map(res => {
        console.log(res);
        return res;
      }),
      map((res: any) => res.items),
      map(items => items.sort((a: any, b: any) => b.popularity - a.popularity)),
      map((artists: any[]) => artists.map((a, i) => this.spotifyArtistToChartItem(a, i, spotifyToken))),
    )
  }

  private spotifyArtistToChartItem(artist: any, index: number, spotifyToken: string) {
    // const votes = Math.floor((artist.popularity * 10000)*this.getCoefficient(index));
    return this.getFollowers(artist.id, spotifyToken).pipe(map(votes => {
      return {
        name: artist.name,
        votes,
        partialVotes: votes,
        votesInString: votes.toLocaleString('en-US').split(',').join('.'),
        seats: 0,
        image: artist.images[0].url
      }
    }));
  }
  private getCoefficient(index: number) {
    return 1 - 0.05*index;
  }

  private getFollowers(artistId: string, spotifyToken: string) {
    return this.http.get(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${spotifyToken}`
      }
    })
    .pipe(
      take(1),
      map((res: any) => res.followers.total)
    );
  }
}

