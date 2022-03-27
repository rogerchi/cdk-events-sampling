import { Stack, StackProps } from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export class EndToEndTestingStack extends Stack {
  public readonly eventBus: EventBus;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.eventBus = new EventBus(this, 'eventBus');
  }
}
