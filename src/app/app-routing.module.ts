import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MestriComponent } from './mestri/mestri.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './core/about/about.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'mestri', component: MestriComponent},
  {path: 'natjecaji', loadChildren: () => import('./natjecaji/natjecaji.module').then(mod => mod.NatjecajiModule)},
  {path: 'about', component: AboutComponent},
  {path: 'account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule)},
  {path: 'mestar', loadChildren: () => import('./mestri/mestri.module').then(mod => mod.MestriModule)},
  {path: 'chat', loadChildren: () => import('./chat/chat.module').then(mod => mod.ChatModule)},
  { path: 'server-error', component: ServerErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
