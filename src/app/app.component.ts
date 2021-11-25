import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

export interface SubMenuInner {
  id: string;
  name: string;
}
export interface SubMenu {
  id: string;
  name: string;
  subMenuInner: SubMenuInner[];
}
export interface Menu {
  id: string;
  name: string;
  subMenu: SubMenu[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  menuDisabled = true;
  public nameExp = '^[a-zA-Z+][a-zA-Z0-9-]+$';
  public menuForm: any;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.menuForm = this.fb.array([
      this.fb.group({
        id: this.generateRandomNumber(),
        name: this.fb.control('', { validators: Validators.required }),
        subMenu: this.fb.array([
          this.fb.group({
            id: this.generateRandomNumber(),
            name: new FormControl('', { validators: Validators.required }),
            subMenuInner: this.fb.array([
              this.fb.group({
                id: this.fb.control(new Date()),
                name: new FormControl('', {
                  validators: Validators.required,
                }),
              }),
            ]),
          }),
        ]),
      }),
    ]);
  }

  // emailFormControl = new FormControl('', [Validators.required]);
  public menuList: Menu[] = [];

  addGrandParentMenuItem() {
    const sampleObject = {
      id: this.generateRandomNumber(),
      name: '',
      subMenu: [
        {
          id: this.generateRandomNumber(),
          name: 'Sub Menu',
          subMenuInner: [
            {
              id: this.generateRandomNumber(),
              name: 'Inner Sub menu',
            },
          ],
        },
      ],
    };
    this.menuList.push(sampleObject);
    console.log(this.menuList);
  }
  deleteGrandParentMenuItem(menuId: string) {
    let index = this.menuList.findIndex((item) => item.id === menuId);
    this.menuList.splice(index, 1);
  }
  generateRandomNumber() {
    return (Math.random() * 100000).toFixed();
  }

  addMainMenu() {
    let mainMenu = this.menuForm.controls as FormArray;
    let menuGroup: FormGroup = this.fb.group({
      id: this.generateRandomNumber(),
      name: this.fb.control('', { validators: Validators.required }),
      subMenu: this.fb.array([
        this.fb.group({
          id: this.generateRandomNumber(),
          name: new FormControl('', { validators: Validators.required }),
          subMenuInner: this.fb.array([
            this.fb.group({
              id: this.fb.control(new Date()),
              name: new FormControl('', {
                validators: Validators.required,
              }),
            }),
          ]),
        }),
      ]),
    });
    mainMenu.push(menuGroup);
  }

  addSubMenu(index: number) {
    let mainMenu = this.menuForm.controls[index].controls.subMenu
      .controls as FormArray;
    let subMenuGroup: FormGroup = this.fb.group({
      id: this.generateRandomNumber(),
      name: this.fb.control('', { validators: Validators.required }),
      subMenuInner: this.fb.array([
        this.fb.group({
          id: this.fb.control(new Date()),
          name: new FormControl('', {
            validators: Validators.required,
          }),
        }),
      ]),
    });
    mainMenu.push(subMenuGroup);
  }

  addSubInnerMenu(mainIndex: number, subIndex: number) {
    let subMenuInner = this.menuForm.controls[mainIndex].controls.subMenu
      .controls[subIndex].controls.subMenuInner.controls as FormArray;
    let subInnerMenuItem: FormGroup = this.fb.group({
      id: this.generateRandomNumber(),
      name: this.fb.control('', { validators: Validators.required }),
    });
    subMenuInner.push(subInnerMenuItem);
  }

  deleteMainMenu(index: number) {
    this.menuForm.removeAt(index);
  }
  deleteSubMenu(mainIndex: number, subIndex: number) {
    this.menuForm.controls[mainIndex].controls.subMenu.removeAt(subIndex);
  }
  deleteSubInnerMenu(mainIndex: number, subIndex: number, innerIndex: number) {
    this.menuForm.controls[mainIndex].controls.subMenu.controls[
      subIndex
    ].controls.subMenuInner.removeAt(innerIndex);
  }

  generateMenuList() {
    const menuList: any[] = [];
    const mainMenu = this.menuForm.controls;
    mainMenu.map((mainItem: any, mainIndex: number) => {
      const obj = {
        name: mainItem.controls.name.value,
        id: mainItem.controls.id.value,
      };
      menuList.push(obj);
      const subMenu = mainMenu[mainIndex].controls?.subMenu?.controls;
      menuList[mainIndex].subMenu = [];
      subMenu.map((subItem: any, subIndex: number) => {
        menuList[mainIndex].subMenu.push({
          name: subItem.controls.name.value,
          id: subItem.controls.id.value,
        });
        const subMenuInner =
          mainMenu[mainIndex].controls?.subMenu.controls[subIndex].controls
            .subMenuInner.controls;
        menuList[mainIndex].subMenu[subIndex].subMenuInner = [];
        subMenuInner.map((innerItem: any, subIndex: number) => {
          menuList[mainIndex].subMenu[subIndex].subMenuInner.push({
            name: innerItem.controls.name.value,
            id: innerItem.controls.id.value,
          });
        });
      });
    });
    this.menuList = menuList;
    this.enableMenuPreview();
  }

  enableMenuPreview() {
    this.menuDisabled = !this.menuList.length;
  }
}
