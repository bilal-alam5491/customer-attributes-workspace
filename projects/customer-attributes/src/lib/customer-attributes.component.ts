import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CustomerAttributesService } from './customer-attributes.service';

interface Channel {
  id: string;
  name: string;
  channelLogo: string;
  mediaRoutingDomain: string | null;
  isInteractive: boolean;
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

  ccmChannels: Channel[] = [];

  @Output() channelSelected = new EventEmitter<Channel>();

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
    this.dataToHost.emit(data);
  }

  onChannelSelect(channel: Channel): void {
    this.channelSelected.emit(channel);
    // Also send additional data about the selection
    this.sendDataToHost({
      event: 'channelSelected',
      timestamp: new Date(),
      selectedChannel: channel,
      totalChannels: this.ccmChannels.length
    });
  }
}
