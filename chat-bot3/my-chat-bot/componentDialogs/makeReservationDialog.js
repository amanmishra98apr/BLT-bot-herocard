const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');

const { ConfirmPrompt, ChoicePrompt, DateTimePrompt, NumberPrompt, TextPrompt } = require('botbuilder-dialogs');

const { DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

const { ActionTypes, ActivityHandler, MessageFactory, CardFactory } = require('botbuilder');

const { ChoiceFactory } = require('botbuilder-choices');

var myapp = {};


const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const DATETIME_PROMPT = 'DATETIME_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
var endDialog = '';

class MakeReservationDialog extends ComponentDialog {

    constructor(conservsationState, userState) {
        super('makeReservationDialog');



        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.noOfParticipantsValidator));
        this.addDialog(new DateTimePrompt(DATETIME_PROMPT));


        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [

            this.getName.bind(this),    // Get name from user
            this.getNumberOfParticipants.bind(this),  // Number of participants for reservation
            this.getPowerOptions.bind(this),
            this.getEquipments.bind(this),
            // this.inPowerStatusOff.bind(this),
            //this.inPowerOutage.bind(this),
            this.inPowerOptions.bind(this),

            this.forPoeorModem.bind(this),
            this.routerPortLight.bind(this),
            this.visible.bind(this),
            this.check.bind(this),
            this.officeTime.bind(this),
            this.rootTop.bind(this),
            this.confirmStep.bind(this),
            this.findroof.bind(this) // Show summary of values entered by user and ask confirmation to make reservation

        ]));




        this.initialDialogId = WATERFALL_DIALOG;


    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }



    async getName(step) {
        endDialog = false;
        console.log(step.result + "from make r dialog");

        return await step.prompt(TEXT_PROMPT, 'Enter Name');



    }

    async getNumberOfParticipants(step) {

        step.values.name = step.result
        return await step.prompt(TEXT_PROMPT, 'Enter Address');

    }

    async getPowerOptions(step) {
        step.values.power_options = step.result
        const card = CardFactory.heroCard(
            'Power Status',
            'select power status Available/Not Available',
            ['https://aka.ms/bf-welcome-card-image'],
            [

                {
                    type: ActionTypes.ImBack,
                    title: 'Available',
                    value: 'Available'
                },
                {
                    type: ActionTypes.ImBack,
                    title: 'Not Available',
                    value: 'Not Available'
                }
            ]
        );
        //var reply = ChoiceFactory.suggestedAction(step, ['Available', 'Not Available'], `select power status`);
        //var reply = MessageFactory.suggestedActions(['Available', 'Not Available'], 'select power status Available/Not Available');
        //var reply = "yes ,No"
        // var msg1 = 'select yes or select no'
        //await step.context.sendActivity(reply)
        await step.context.sendActivity({ attachments: [card] });
        return await step.prompt(TEXT_PROMPT,)
    }

    async getEquipments(step) {
        step.values.inPower = step.result;
        console.log("card res " + step.values.inPower)
        
            if (step.values.inPower.toLowerCase() == 'available') {
                myapp.flag = true;
                console.log("not2avail: " + myapp.flag);
                const card2 = CardFactory.heroCard(
                    'Equipments',
                    'Select Equipment POE/Modem/MUX',
                    ['https://aka.ms/bf-welcome-card-image'],
                    [

                        {
                            type: ActionTypes.ImBack,
                            title: 'POE',
                            value: 'POE'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'Modem',
                            value: 'Modem'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'MUX',
                            value: 'MUX'
                        }
                    ]
                );
                //var equipment = MessageFactory.suggestedActions(['POE', 'Modem', 'MUX'], 'select equipment POE/Modem/MUX');
                //await step.context.sendActivity(equipment);
                await step.context.sendActivity({ attachments: [card2] });
                return await step.prompt(TEXT_PROMPT,);
            }
            else if (step.values.inPower.toLowerCase() == 'not available') {
                myapp.flag = false;
                //step.values.inPowerOff = step.result;
                console.log("notavail: " + myapp.flag);
                console.log(step.values.inPower)
                const card3 = CardFactory.heroCard(
                    'Power status',
                    'Confirm Power Outage/Power Shutdown',
                    ['https://aka.ms/bf-welcome-card-image'],
                    [

                        {
                            type: ActionTypes.ImBack,
                            title: 'Power Outage',
                            value: 'Power Outage'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'Power Shutdown',
                            value: 'Power Shutdown'
                        }

                    ]
                );
                //var pops = MessageFactory.suggestedActions(['Power Outage', 'Power Shutdown'], 'Confirm Power Outage/Power Shutdown');

                //await step.context.sendActivity(pops)
                await step.context.sendActivity({ attachments: [card3] });
                return await step.prompt(TEXT_PROMPT,)

            }
            else{
                return await step.context.sendActivity('please enter valid input')
            }
        

    }



    ///////////////////////////////////
    async inPowerOptions(step) {
        console.log("hiie aman")
        step.values.equip = step.result
        console.log("hii aman2222")
        if (myapp.flag == true) {
            if (step.values.equip.toLowerCase() == "poe") {
                myapp.flag2 = true;
                //console.log("result"+step.values.inPower)
                const card4 = CardFactory.heroCard(
                    'POE',
                    'POE light indication Red/Green/Amber',
                    ['https://aka.ms/bf-welcome-card-image'],
                    [

                        {
                            type: ActionTypes.ImBack,
                            title: 'Red',
                            value: 'Red'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'Green',
                            value: 'Green'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'Amber',
                            value: 'Amber'
                        }

                    ]
                );
                //var poe = MessageFactory.suggestedActions(['Red', 'Green', 'Amber'], 'POE light indication Red/Green/Amber');
                //await step.context.sendActivity(poe)
                await step.context.sendActivity({ attachments: [card4] });
                return await step.prompt(TEXT_PROMPT,)
            }
            else if (step.values.equip.toLowerCase() == "modem") {
                myapp.flag2 = true;
                //console.log("result"+step.values.inPower)
                const card5 = CardFactory.heroCard(
                    'Modem',
                    'Modem light indication Red/Green/Amber',
                    ['https://aka.ms/bf-welcome-card-image'],
                    [

                        {
                            type: ActionTypes.ImBack,
                            title: 'Red',
                            value: 'Red'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'Green',
                            value: 'Green'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'Amber',
                            value: 'Amber'
                        }

                    ]
                );
                //var modem = MessageFactory.suggestedActions(['Red', 'Green', 'Amber'], 'Modem light indication Red/Green/Amber');
                //await step.context.sendActivity(modem);
                await step.context.sendActivity({ attachments: [card5] });
                return await step.prompt(TEXT_PROMPT,);
            }
            else if (step.values.equip.toLowerCase() == "mux") {
                myapp.flag2 = true;
                //console.log("result"+step.values.inPower)
                const card6 = CardFactory.heroCard(
                    'MUX',
                    'MUX light indication Red/Green/Amber',
                    ['https://aka.ms/bf-welcome-card-image'],
                    [

                        {
                            type: ActionTypes.ImBack,
                            title: 'Red',
                            value: 'Red'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'Green',
                            value: 'Green'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'Amber',
                            value: 'Amber'
                        }

                    ]
                );
                //var mux = MessageFactory.suggestedActions(['Red', 'Green', 'Amber'], 'MUX light indication Red/Green/Amber');
                //await step.context.sendActivity(mux);
                await step.context.sendActivity({ attachments: [card6] });
                return await step.prompt(TEXT_PROMPT,);
            }
            else{
                return await step.context.sendActivity('please enter valid input');
            }
        }
        else {
            myapp.flag2 = false;
            step.values.equip = step.result;
            if (step.values.equip.toLowerCase() == 'power outage') {

                endDialog = true;
                //return await step.prompt(TEXT_PROMPT, 'update the ticket')
                return await step.context.sendActivity('Update the ticket')
            }
            else if(step.values.equip.toLowerCase() == 'power shutdown'){
                endDialog = true;
                //return await step.prompt(TEXT_PROMPT, 'Ask for ETR')
                return await step.context.sendActivity('Ask for ETR')
            }
            else{
                return await step.context.sendActivity('please enter valid input');
            }

        }


    }





    //here
    async forPoeorModem(step) {
        step.values.ce = step.result;
        if (myapp.flag2 == true) {
            if (myapp.flag2 == true) {
                if (step.values.equip.toLowerCase() == 'poe' || step.values.equip.toLowerCase() == 'modem') {
                    myapp.flag3 = 1;
                    console.log(step.values.equip)
                    return await step.prompt(TEXT_PROMPT, 'Router port no');
                }

                else {
                    myapp.flag3 = 0;
                    console.log("mux: " + step.values.mux);
                    return await step.prompt(TEXT_PROMPT, 'Router port no');

                }
            }
        }
    }

    async routerPortLight(step) {
        step.values.rPort = step.result;
        if (myapp.flag3 == 1) {
            myapp.flag4 = 1;
            const card7 = CardFactory.heroCard(
                'Router',
                'Select rout port light indication Admin light/Data light/Both',
                ['https://aka.ms/bf-welcome-card-image'],
                [

                    {
                        type: ActionTypes.ImBack,
                        title: 'Admin light',
                        value: 'Admin light'
                    },
                    {
                        type: ActionTypes.ImBack,
                        title: 'Data light',
                        value: 'Data light'
                    },
                    {
                        type: ActionTypes.ImBack,
                        title: 'Both',
                        value: 'Both'
                    }

                ]
            );
            // var rpl = MessageFactory.suggestedActions(['Admin light', 'Data light', 'Both'], 'Select rout port light indication Admin light/Data light/Both');
            await step.context.sendActivity({ attachments: [card7] });
            return await step.prompt(TEXT_PROMPT,)
        }
        else {
            myapp.flag4 = 0;
            const card7 = CardFactory.heroCard(
                'Router',
                'Select rout port light indication Admin light/Data light/Both',
                ['https://aka.ms/bf-welcome-card-image'],
                [

                    {
                        type: ActionTypes.ImBack,
                        title: 'Admin light',
                        value: 'Admin light'
                    },
                    {
                        type: ActionTypes.ImBack,
                        title: 'Data light',
                        value: 'Data light'
                    },
                    {
                        type: ActionTypes.ImBack,
                        title: 'Both',
                        value: 'Both'
                    }

                ]
            );
            //var rpl = MessageFactory.suggestedActions(['Admin light', 'Data light', 'Both'], 'Select rout port light indication Admin light/Data light/Both');
            await step.context.sendActivity({ attachments: [card7] });
            return await step.prompt(TEXT_PROMPT,)
        }
    }

    async visible(step) {
        step.values.rpl = step.result;
        if (myapp.flag4 == 1) {
            myapp.flag5 = 1;
            if (step.values.rpl.toLowerCase() == 'admin light' || step.values.rpl.toLowerCase() == 'data light' || step.values.rpl.toLowerCase() == 'both') {

                const card8 = CardFactory.heroCard(
                    'Jack Out and Jack IN',
                    'JOJI device at POE yes/no',
                    ['https://aka.ms/bf-welcome-card-image'],
                    [

                        {
                            type: ActionTypes.ImBack,
                            title: 'Yes',
                            value: 'Yes'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'No',
                            value: 'No'
                        }

                    ]
                );
                //var joji = MessageFactory.suggestedActions(['yes', 'no'], 'JOJI device at POE yes/no');
                await step.context.sendActivity({ attachments: [card8] });
                return await step.prompt(TEXT_PROMPT,);
            }
            else{
                return await step.context.sendActivity('please enter valid input');
            }
        }
        else {
            myapp.flag5 = 0;
            if (step.values.rpl.toLowerCase() == 'admin light' || step.values.rpl.toLowerCase() == 'data light' || step.values.rpl.toLowerCase() == 'both') {
                //return await step.context.sendActivity("coutomer office time?")
                return await step.prompt(DATETIME_PROMPT, "customer office time?")
            }
            else{
                return await step.context.sendActivity('please enter valid input');
            }
        }
    }

    async check(step) {
        step.values.joji = step.result;
        if (myapp.flag5 == 1) {
            if (step.values.joji.toLowerCase() == 'yes') {
                return await step.context.sendActivity("check for result");
            }
            else if(step.values.joji.toLowerCase() == 'no'){
                myapp.flag6 = 'b';
                const card9 = CardFactory.heroCard(
                    'Reboot',
                    'POE rebooted yes/no',
                    ['https://aka.ms/bf-welcome-card-image'],
                    [

                        {
                            type: ActionTypes.ImBack,
                            title: 'Yes',
                            value: 'Yes'
                        },
                        {
                            type: ActionTypes.ImBack,
                            title: 'No',
                            value: 'No'
                        }

                    ]
                );
                //var chk = MessageFactory.suggestedActions(['yes', 'no'], 'POE rebooted yes/no');
                await step.context.sendActivity({ attachments: [card9] });
                return await step.prompt(TEXT_PROMPT,)
            }
            else{
                return await step.context.sendActivity('please enter valid input');
            }
        }
        else if (myapp.flag5 == 0) {
            myapp.flag6 = 'a';
            const card10 = CardFactory.heroCard(
                'Permission',
                'Select Roof Top permission availablity yes/no',
                ['https://aka.ms/bf-welcome-card-image'],
                [

                    {
                        type: ActionTypes.ImBack,
                        title: 'Yes',
                        value: 'Yes'
                    },
                    {
                        type: ActionTypes.ImBack,
                        title: 'No',
                        value: 'No'
                    }

                ]
            );
            //var rt = MessageFactory.suggestedActions(['yes', 'no'], 'roof top permission availablity yes/no');
            endDialog = true;
            await step.context.sendActivity({ attachments: [card10] });
            return await step.prompt(TEXT_PROMPT,)
        }
    }
    async officeTime(step) {
        step.values.ckeck = step.result;
        console.log("office time: " + step.values.ckeck)
        if (myapp.flag6 == 'b') {
            console.log("office time: " + step.values.ckeck)
            if (step.values.ckeck.toLowerCase() == 'yes') {
                myapp.flag7 = true;
                //return await step.context.sendActivity("customer office time?")
                return await step.prompt(DATETIME_PROMPT, "customer office time?")
            }
            else if(step.values.ckeck.toLowerCase() == 'no'){
                myapp.flag7 = false;
                //return await step.context.sendActivity("Please reboot POE")
                return await step.prompt(TEXT_PROMPT, "Please reboot POE")
            }
            else{
                return await step.context.sendActivity('please enter valid input');
            }
        }
        return await step.context.sendActivity("Thanks")
    }

    async rootTop(step) {
        if (myapp.flag7 == true) {
            myapp.flag8 = true;
            const card10 = CardFactory.heroCard(
                'Permission POE/Modem',
                'Select Roof Top permission availablity yes/no',
                ['https://aka.ms/bf-welcome-card-image'],
                [

                    {
                        type: ActionTypes.ImBack,
                        title: 'Yes',
                        value: 'Yes'
                    },
                    {
                        type: ActionTypes.ImBack,
                        title: 'No',
                        value: 'No'
                    }

                ]
            );
            //var rt = MessageFactory.suggestedActions(['yes', 'no'], 'Roof top permission availablity yes/no');
            await step.context.sendActivity({ attachments: [card10] });
            return await step.prompt(TEXT_PROMPT,)

        }
        else if (myapp.flag7 == false) {
            myapp.flag8 = false;
            return await step.prompt(DATETIME_PROMPT, "Customer office time?");
        }

    }


    async confirmStep(step) {
        console.log("flag2: " + myapp.flag2)

        step.values.noOfParticipants = step.result

        if (myapp.flag8 == false) {
            myapp.flag9 = true;
            const card10 = CardFactory.heroCard(
                'Permission ',
                'Select Roof Top permission availablity yes/no',
                ['https://aka.ms/bf-welcome-card-image'],
                [

                    {
                        type: ActionTypes.ImBack,
                        title: 'Yes',
                        value: 'Yes'
                    },
                    {
                        type: ActionTypes.ImBack,
                        title: 'No',
                        value: 'No'
                    }

                ]
            );

            await step.context.sendActivity({ attachments: [card10] });
            return await step.prompt(TEXT_PROMPT,)
            endDialog = true;
            //await step.context.sendActivity(msg);
        }
        else {
            myapp.flag9 = false;
            //var msg = ` You have entered following values: \n Your Name: ${step.values.name}\n Your: ${step.values.noOfParticipants}\n `

            //await step.context.sendActivity(msg);
            endDialog = true;
            //return await step.prompt(TEXT_PROMPT, 'Thanks');
            return await step.context.sendActivity("Thanks")
        }
    }

    async findroof(step) {

        if (myapp.flag9 == true) {
            //step.values.noOf = step.result;
            endDialog = true;
            return await step.prompt(TEXT_PROMPT, 'Thanks');

        }
    }

    /////////////////////////////////////////////////////////////////////





    async isDialogComplete() {
        return endDialog;
    }


}

module.exports.MakeReservationDialog = MakeReservationDialog;







