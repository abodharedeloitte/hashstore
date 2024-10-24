import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { ServiceService } from './service/service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface Item {
  category: string;
  name: string;
  desc: string;
  img: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  item_type = 'dashboard';
  alreadyLogin: boolean = false;
  component: boolean = false
  add_to_card: boolean = false;
  item_category = ['Mobile', 'Home & Kitchen', 'Electronics', 'Grocery'];

  add_to_card_form: FormGroup
  sell_item_form: FormGroup

  constructor(private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar, private backendService: ServiceService, private router: Router) {
    this.add_to_card_form = this.fb.group({
      address: ['', Validators.required],
      payment_mode: ['Online', Validators.required],
      quantity: ['', Validators.required],
    });

    this.sell_item_form = this.fb.group({
      item_id: [''],
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['', Validators.required],
      desc: ['', Validators.required],
      price: ['', Validators.required],
      img: ['', Validators.required],
      user_id: ['', Validators.required],
      type: ['']
    })
  }

  products: Item[] = [];
  users_sell_items: any[] = [];
  auth: any;
  ngOnInit() {
    // localStorage.clear()
    this.auth = localStorage.getItem('customer_auth');
    const expirationDate = localStorage.getItem('customer_authExpiration');
    if (this.auth && expirationDate) {
      const date = new Date(expirationDate);
      if (date <= new Date()) {
        this.alreadyLogin = false;
        this.signout();
      } else {
        this.alreadyLogin = true
      }
    }
    else {
      this.alreadyLogin = false
    }

    this.accessAllItem();
  }

  accessAllItem() {
    this.backendService.getAllItems().subscribe((res) => {
      if (res.result) {
        this.products = res.result;
        this.products.forEach((item: any) => {
          if (item.user_id == localStorage.getItem('customer_auth')) {
            this.users_sell_items.push(item);
          }
        })
      }
    })
  }

  signout() {
    localStorage.removeItem('customer_auth');
    localStorage.removeItem('customer_authExpiration');
    // this.router.navigate(['/']);
  }

  home() {
    this.component = false;
    this.add_to_card = false;
  }

  register() {
    const dialog = this.dialog.open(LoginComponent, {
      data: {
        title: 'Register'
      }
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.backendService.register(res).subscribe((res) => {
          if (res) {
            this.snackBar.open(`${res.message}`, 'Close', { duration: 2000 });
            const dialog = this.dialog.open(LoginComponent, {
              data: {
                title: 'Login',
              }
            });
            dialog.afterClosed().subscribe((res) => {
              if (res) {
                this.backendService.login(res).subscribe((res) => {
                  if (res) {
                    localStorage.setItem('token', res.token)
                    const expirationDate = new Date(new Date().getTime() + 10 * 60 * 60 * 1000);
                    localStorage.setItem("customer_auth", res.result[0]['user_id']);
                    localStorage.setItem("customer_authExpiration", expirationDate.toString());
                    this.alreadyLogin = true
                    this.snackBar.open(`${res.message}`, 'Close', { duration: 2000 })
                  } else {
                    this.snackBar.open(`${res.message}`, 'Close', { duration: 3000 });
                  }
                })
              }
            })
          }
        })
      }
    })

  }
  login() {
    const dialog = this.dialog.open(LoginComponent, {
      data: {
        title: 'Login',
      }
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.backendService.login(res).subscribe((res) => {
          if (res.result) {
            localStorage.setItem('token', res.token)
            const expirationDate = new Date(new Date().getTime() + 10 * 60 * 60 * 1000);
            localStorage.setItem("customer_auth", res.result[0]['user_id']);
            localStorage.setItem("customer_authExpiration", expirationDate.toString());
            this.alreadyLogin = true
            this.snackBar.open(`Login Successfully`, 'Close', { duration: 3000 });
          } else {
            this.snackBar.open(`${res.message}`, 'Close', { duration: 3000 });
          }
        })
      }
    })
  }

  logOut() {
    localStorage.clear();
    this.component = false;
    this.add_to_card = false;
    this.alreadyLogin = false;
  }
  userId: any;
  user_data: any;
  users_purschase_items: any[] = [];
  profile() {
    this.component = true;
    this.add_to_card = false;
    this.userId = localStorage.getItem('customer_auth');
    this.backendService.getUserDetails(this.userId).subscribe((res) => {
      if (res?.result) {
        this.user_data = res.result[0];
        this.user_data?.purchase_items.forEach((item: any) => {
          this.products.forEach((product: any) => {
            if (product.item_id == item.item_id) {
              let data = { ...product, payment_status: item.payment_status, shipment_address: item.shipment_address, payment_mode: item.payment_mode, status: item.status, price: item.price, quantity: item.quantity }
              this.users_purschase_items.push(data);
            }
          })
        })
      } else {
        this.snackBar.open(res.message, 'Close', { duration: 3000 });
      }
    })
  }

  selected_item: any;
  qty: number = 1;
  paymentModes = ['Online', 'Cash On Delivary'];
  mode: any;
  addToCard(data: any) {
    if (this.alreadyLogin) {
      this.selected_item = data;
      this.add_to_card = true;
      this.component = false;
    } else {
      this.snackBar.open('Please login first', 'Close', { duration: 2000 })
    }
  }

  purchase() {
    if (this.add_to_card_form.valid) {
      let item_id = this.selected_item['item_id'];
      let user_id = localStorage.getItem('customer_auth');
      let price = (this.selected_item.price * this.qty).toFixed(2);
      this.backendService.addToCard({ form: this.add_to_card_form.value, item_id: item_id, user_id: user_id, price: price }).subscribe((res) => {
        if (res.result) {
          this.add_to_card = false;
          this.component = true;
          this.profile();
          if (this.add_to_card_form.get('payment_mode')?.value === 'Online') {
            this.payment(item_id, price, 'Online');
          }
        }
      })
    } else {
      this.snackBar.open('Please fill all the fields', 'Close', { duration: 1000 })
    }
  }

  deleteItemFromCard(item_id: any, type: any) {
    if (type === 'from_my_item') {
      this.backendService.removeItemFromCard(item_id, localStorage.getItem('customer_auth')).subscribe((res) => {
        this.users_purschase_items = this.users_purschase_items.filter(pro => pro.item_id === item_id);
      })
    } else if (type == 'from_sell_card') {
      this.backendService.deleteItemById(item_id).subscribe((res) => {
        if (res.result) {
          this.users_sell_items = this.users_sell_items.filter(pro => pro.item_id !== item_id);
        }
      })
    }
  }

  edit: boolean = false;

  editItem(data: any) {
    this.edit = true;
    this.sell_item_form.patchValue({ item_id: data.item_id })
    this.sell_item_form.patchValue({ category: data.category })
    this.sell_item_form.patchValue({ name: data.name })
    this.sell_item_form.patchValue({ desc: data.desc })
    this.sell_item_form.patchValue({ price: data.price })
    this.sell_item_form.patchValue({ quantity: data.quantity })
    this.sell_item_form.patchValue({ quantity: data.quantity })
  }

  payment(item_id: any, amount: any, payment_mode: any) {
    const paymentType = 'Settlement';
    const type = 'buy'
    this.backendService.generateTransaction(localStorage.getItem('customer_auth'), item_id, amount, payment_mode, paymentType, type).subscribe((res) => {
    })
  }


  tradeItems: any;

  change_item_type(type: any) {
    if (type) {
      this.item_type = type;
      this.edit = false;
    }
    if (type == 'trade') {
      this.accessTradeItems();
    }
  }

  accessTradeItems() {
    this.backendService.accessAllTradeItems().subscribe((res) => {
      if (res.result) {
        this.tradeItems = res.result;
      }
    })
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.sell_item_form.patchValue({
        img: `assets/${file.name}`
      });
    }
  }

  addItem() {
    this.sell_item_form.patchValue({ user_id: localStorage.getItem('customer_auth') });
    this.sell_item_form.patchValue({ type: 'sell' });
    if (this.sell_item_form.valid) {
      this.backendService.addItem(this.sell_item_form.value).subscribe((res) => {
        this.users_sell_items = []
        this.accessAllItem();
        this.sell_item_form.reset();
      })
    }
  }


  addTradeItem() {
    this.sell_item_form.patchValue({ user_id: localStorage.getItem('customer_auth') });
    this.sell_item_form.patchValue({ type: 'trade' });
    if (this.sell_item_form.valid) {
      this.backendService.addItem(this.sell_item_form.value).subscribe((res) => {
        this.accessTradeItems();
        this.snackBar.open(`${res.message}`, 'Close', { duration: 2000 });
        this.sell_item_form.reset();
      })
    }
  }

  EditItem() {
    this.backendService.updateItemById(this.sell_item_form.value).subscribe((res) => {
      if (res.result) {
        this.users_sell_items = []
        this.accessAllItem();
        this.sell_item_form.reset();
      }
    })
  }
}
