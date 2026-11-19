import { Component } from '@angular/core';

/**
 * The andresfuribeg lotus logo, adapted to the dark site: the outer petals take the
 * text color, as they do in the original light version (#0B1220 on #F5F7FA).
 * The stroke draws the gap between petals, so set --lotus-gap to the background behind it.
 */
@Component({
  selector: 'app-lotus',
  standalone: true,
  template: `
    <svg viewBox="0 10 120 84" aria-hidden="true" focusable="false">
      <path class="outer" transform="translate(60 88) rotate(-62) scale(.8)" [attr.d]="petal" />
      <path class="outer" transform="translate(60 88) rotate(62) scale(.8)" [attr.d]="petal" />
      <path class="mid" transform="translate(60 88) rotate(-31) scale(.93)" [attr.d]="petal" />
      <path class="mid" transform="translate(60 88) rotate(31) scale(.93)" [attr.d]="petal" />
      <path class="center" transform="translate(60 88)" [attr.d]="petal" />
    </svg>
  `,
  styles: [`
    :host { display: inline-block; line-height: 0; }
    svg { display: block; width: 100%; height: auto; overflow: visible; }
    path { stroke: var(--lotus-gap, var(--bg-0)); stroke-width: 3; }
    .outer { fill: var(--lotus-outer, #F5F7FA); }
    .mid { fill: #1B4F9C; }
    .center { fill: #2F86F0; }
  `]
})
export class LotusComponent {
  readonly petal = 'M0 0C-17-22-15-52 0-70C15-52 17-22 0 0Z';
}
