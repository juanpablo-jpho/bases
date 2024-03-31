import { Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {

  @Input() appHighlight = '';
  @Input() name = 'default';


  constructor(private el: ElementRef) {
    // this.el.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('mouseenter') 
  onMouseEnter() {
    this.highlight(this.appHighlight);
  }

  @HostListener('mouseleave') 
  onMouseLeave() {
    this.highlight('');
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

  @HostListener('click') 
  registerEvent() {
    console.log('registerEvent -> ', this.name);
  }

}
