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

  alreadyLogin: boolean = false;
  component: boolean = false
  add_to_card: boolean = false;

  add_to_card_form: FormGroup

  constructor(private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar, private backendService: ServiceService, private router: Router) {
    this.add_to_card_form = this.fb.group({
      address: ['', Validators.required],
      payment_mode: ['', Validators.required],
      quantity: ['Online', Validators.required],
    });

  }

  products: Item[] = [];
  auth: any;
  ngOnInit() {
    // localStorage.clear()
    this.auth = localStorage.getItem('customer_auth');
    const expirationDate = localStorage.getItem('customer_authExpiration');
    console.log(this.auth, expirationDate);
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

    this.backendService.getAllItems().subscribe((res) => {
      this.products = res.result;
    })
  }

  signout() {
    localStorage.removeItem('customer_auth');
    localStorage.removeItem('customer_authExpiration');
    // this.router.navigate(['/']);
  }

  home() {
  }

  register() {
    const dialog = this.dialog.open(LoginComponent, {
      data: {
        title: 'Register'
      }
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        console.log(res);
        this.backendService.register(res).subscribe((res) => {
          if (res) {
            const dialog = this.dialog.open(LoginComponent, {
              data: {
                title: 'Login',
              }
            });
            dialog.afterClosed().subscribe((res) => {
              if (res) {
                this.backendService.login(res).subscribe((res) => {
                  console.log(res);
                  if (res) {
                    localStorage.setItem('token', res.token)
                    const expirationDate = new Date(new Date().getTime() + 10 * 60 * 60 * 1000);
                    localStorage.setItem("customer_auth", res.result[0]['user_id']);
                    localStorage.setItem("customer_authExpiration", expirationDate.toString());
                    this.alreadyLogin = true
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
    console.log('Login called')
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
          } else {
            this.snackBar.open(`${res.message}`, 'Close', { duration: 3000 });
          }
        })
      }
    })
  }

  userId: any;
  user_data: any;
  users_purschase_items: any[] = [];
  profile() {
    this.component = true;
    this.add_to_card = false;
    this.userId = localStorage.getItem('customer_auth');
    // console.log(this.userId);
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
        console.log(this.users_purschase_items)
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
      let user_id = this.auth;
      let price = (this.selected_item.price * this.qty).toFixed(2);
      console.log(this.add_to_card_form.value)
      this.backendService.addToCard({ form: this.add_to_card_form.value, item_id: item_id, user_id: user_id, price: price }).subscribe((res) => {
        console.log(res);
        if (res.result) {
          this.add_to_card = false;
          this.component = true;
          this.profile();
        }
      })
    } else {
      this.snackBar.open('Please fill all the fields', 'Close', { duration: 1000 })
    }
  }

  deleteItemFromCard(item_id: any) {
    console.log(item_id, this.auth);
    this.backendService.removeItemFromCard(item_id, this.auth).subscribe((res) => {
      console.log(res);
      this.users_purschase_items = this.users_purschase_items.filter(pro => pro.item_id === item_id);
    })
  }

  payment(item_id: any, amount: any, payment_mode: any) {
    const paymentType = 'Settlement';
    const type = 'buy'
    this.backendService.generateTransaction(this.auth, item_id, amount, payment_mode, paymentType, type).subscribe((res) => {
      console.log(res);
    })
  }
}
