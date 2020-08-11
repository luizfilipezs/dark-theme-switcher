interface InitSettings {
  glow: boolean;
}

interface SwitcherOptions {
  id: string;
  class: string;
  glow?: boolean;
}

class ThemeSwitcher {

  private options: SwitcherOptions;

  readonly DARK_THEME = 'BIN_DARK_THEME';
  readonly LIGHT_THEME = 'BIN_LIGHT_THEME';

  readonly MOON_SVG = 'https://raw.githubusercontent.com/anjalbinayak/dark-theme-switcher/master/assets/svgs/moon.svg';
  readonly SUN_SVG = 'https://raw.githubusercontent.com/anjalbinayak/dark-theme-switcher/master/assets/svgs/sun.svg';

  TOGGLER_IMAGE: HTMLImageElement;

  constructor(initOptions: InitSettings = { glow: false }) {
    this.options = {
      id: 'bin-theme-toggler',
      class: 'bin_theme_toggler'
    };
    this.init(initOptions);
  }

  init(initOptions: InitSettings): InitSettings {
    this.TOGGLER_IMAGE = document.createElement('img');
    this.TOGGLER_IMAGE.classList.add('bin-image-toggler');
    this.TOGGLER_IMAGE.addEventListener('click', () => this.toggleTheme());
    this.options.glow = initOptions.glow;

    this.createContextMenu();
    this.createToggler();
    this.applyTheme();
    this.draggable();

    window.addEventListener('click', e => {
      if (!this.getContextMenu().contains(e.target as Node)) this.hideContextMenu();
    });

    window.addEventListener('contextmenu', e => {
      if (document.getElementById(this.options.id).contains(e.target as Node)) {
        this.showContextMenu();
        e.preventDefault();
      }

      if(this.isContextMenuVisible())  e.preventDefault();

    });

    return initOptions;
  }

  draggable(): void {
    dragElement(document.getElementById(this.options.id));

    function dragElement(elmnt: HTMLElement) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

      elmnt.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';

        localStorage.setItem('bin-theme-toggler-top', elmnt.style.top);
        localStorage.setItem('bin-theme-toggler-left', elmnt.style.left);
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }

  getContextMenu(): HTMLElement {
    return document.querySelector('#bin-theme-context-menu');
  }

  getCurrentDisplayMode(): string {
    return localStorage.getItem('bin-theme-toggler-mode');
  };

  getTogglerPosition(): string {
    return localStorage.getItem('bin-theme-toggler-position');
  }

  setTogglerPosition(position: 'fixed' | 'absolute'): void {
    localStorage.setItem('bin-theme-toggler-position', position);
  }

  getTopPositionOfToggler(): string {
    return localStorage.getItem('bin-theme-toggler-top');
  }

  setTopPositionOfToggler(topPosition: number): void {
    localStorage.setItem('bin-theme-toggler-top', `${topPosition}px`);
  }

  getLeftPositionOfToggler(): string {
    return localStorage.getItem('bin-theme-toggler-left');
  }

  setLeftPositionOfToggler(leftPosition: number): void {
    localStorage.setItem('bin-theme-toggler-left', `${leftPosition}px`);
  }

  setTheme(key: string): void {
    localStorage.setItem('bin-theme-toggler-mode', key);
  }

  createContextMenu(): void {
    const div = document.createElement('div');
    div.setAttribute('id', 'bin-theme-context-menu');

    const input = document.createElement('input');
    input.type = 'checkbox';

    if (this.getTogglerPosition() == 'fixed') input.checked = true;

    input.addEventListener('change', () => {
      this.hideContextMenu();
      let isChecked = input.checked;

      if (isChecked) {
        document.getElementById(this.options.id).style.position = 'fixed';
        this.setTogglerPosition('fixed');
      } else {
        document.getElementById(this.options.id).style.position = 'absolute';
        this.setTogglerPosition('absolute');
      }
    });

    div.innerHTML +=' <small> Fixed Position </small>';
    div.appendChild(input);
   
    document.body.appendChild(div);
  }

  showContextMenu(): void {
    const contextMenu = this.getContextMenu();

    if (contextMenu) {
      contextMenu.style.display = 'block';
      contextMenu.style.top = this.getTopPositionOfToggler() || `${20}%`;
      contextMenu.style.left = this.getLeftPositionOfToggler() || `${90}%`;
      contextMenu.style.position =  this.getTogglerPosition();
    }
  }

  isContextMenuVisible(): string | boolean {
    const contextMenu = this.getContextMenu();

    return contextMenu ?
      contextMenu.style.display == 'block' : false;
  }

  hideContextMenu(): void {
    let contextMenu = this.getContextMenu();
    if (contextMenu) contextMenu.style.display = 'none';
  }

  createToggler(): void {
    const div = document.createElement('div');

    div.classList.add(this.options.class);
    div.setAttribute('id', this.options.id);

    if (this.options.glow) div.classList.add('glow');

    div.style.top =  this.getTopPositionOfToggler() || 20 + '%';
    div.style.left = this.getLeftPositionOfToggler() || 90 + '%';
    div.style.position = this.getTogglerPosition() || 'absolute';
    div.style.zIndex = '5050';

    if (this.getCurrentDisplayMode() === this.DARK_THEME)
      this.createSun(div);
    else
      this.createMoon(div);

    document.body.appendChild(div);
  }

  createMoon(div: Element): void {
    this.TOGGLER_IMAGE.setAttribute(
      'src',
      this.MOON_SVG
    );
    div.appendChild(this.TOGGLER_IMAGE);
  }

  createSun(div: Element): void {
    this.TOGGLER_IMAGE.setAttribute(
      'src',
      this.SUN_SVG
    );
    div.appendChild(this.TOGGLER_IMAGE);
  }

  activateLightTheme(): void {
    let root = document.getElementsByTagName('html')[0];
    root.classList.remove('bin-dark-theme');
    
    let images = document.querySelectorAll('img');
    images.forEach(img => img.classList.remove('bin-dark-theme-image'));

    this.setTheme(this.LIGHT_THEME);
    this.TOGGLER_IMAGE.setAttribute(
      'src',
      this.MOON_SVG
    );
  }

  activateDarkTheme(): void {
    let root = document.getElementsByTagName('html')[0];
    root.classList.add('bin-dark-theme');

    let images = document.querySelectorAll('img');

    images.forEach(img => {
      if (!img.classList.contains('bin-image-toggler'))
        img.classList.add('bin-dark-theme-image');
    });

    this.setTheme(this.DARK_THEME);
    this.TOGGLER_IMAGE.setAttribute(
      'src',
      this.SUN_SVG
    );
  }

  toggleTheme(): void {
    if (this.getCurrentDisplayMode() === this.DARK_THEME)
      this.activateLightTheme();
    else
      this.activateDarkTheme();
  }

  applyTheme(): void {
    if (this.getCurrentDisplayMode() === this.DARK_THEME)
      this.activateDarkTheme();
    else
      this.activateLightTheme();
  }
}

new ThemeSwitcher();