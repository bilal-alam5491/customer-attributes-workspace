import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CustomerAttributesService } from './customer-attributes.service';

interface Customer {
  id: number;
  name: string;
  email: string;
  status: string;
  joinDate: Date;
  lastPurchase: number;
}

@Component({
  selector: 'lib-customer-attributes',
  templateUrl: './customer-attributes.component.html',
  styleUrls: ['./customer-attributes.component.scss'],
})
export class CustomerAttributesComponent implements OnInit {
  // New input/output properties for custom data communication
  @Input() customData: any;
  @Output() dataToHost = new EventEmitter<any>();

  ccmChannels: any[] = [];

  @Input() customers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active',
      joinDate: new Date('2023-01-15'),
      lastPurchase: 299.99
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Inactive',
      joinDate: new Date('2023-02-20'),
      lastPurchase: 199.50
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'Active',
      joinDate: new Date('2023-03-10'),
      lastPurchase: 450.00
    }
  ];

  @Output() customerSelected = new EventEmitter<Customer>();
  @Output() customersChanged = new EventEmitter<Customer[]>();

  constructor(private customerAttributesService: CustomerAttributesService) { }

  ngOnInit(): void {
    this.updateFQDNFromCustomData();
    this.getCCMChannels()
  }

  getCCMChannels() {
    this.customerAttributesService.getCcmChannels().subscribe({
      next: (data) => {
        console.log('Fetched CCM Channels:', data);
        this.ccmChannels = data;
      },
      error: (error) => {
        console.error('Error fetching CCM Channels:', error);
      }
    });
  }

  private updateFQDNFromCustomData(): void {
    if (this.customData) {
      console.log('Received data from host:', this.customData);

      if (this.customData?.FQDN) {
        this.customerAttributesService.setFQDN(this.customData.FQDN);
      } else {
        console.warn('No FQDN found in customData');
      }

      this.sendDataToHost({
        message: 'Data received successfully',
        timestamp: new Date(),
      });
    }
  }

  // Method to send data to host
  sendDataToHost(data: any): void {
    console.log('Sending data to host:', data);
    this.dataToHost.emit(data);
  }

  onCustomerSelect(customer: Customer): void {
    this.customerSelected.emit(customer);
    // Also send additional data about the selection
    this.sendDataToHost({
      event: 'customerSelected',
      timestamp: new Date(),
      selectedCustomer: customer,
      totalCustomers: this.customers.length
    });
  }

  updateCustomers(newCustomers: Customer[]): void {
    this.customers = [...newCustomers];
    this.customersChanged.emit(this.customers);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase() === 'active' ? 'status-active' : 'status-inactive';
  }
}
