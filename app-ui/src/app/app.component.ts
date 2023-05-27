import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string = 'MediBase';

  constructor(private auth: AuthService) { }

  public ngOnInit(): void {
    this.auth.checkAuth();
  }
}
