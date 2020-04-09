import * as tslib_1 from "tslib";
import { CommonModule, DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, NgModule, NgZone } from '@angular/core';
import { appInitialize } from './app-initialize';
import { BooleanValueAccessor } from './directives/control-value-accessors/boolean-value-accessor';
import { NumericValueAccessor } from './directives/control-value-accessors/numeric-value-accesssor';
import { RadioValueAccessor } from './directives/control-value-accessors/radio-value-accessor';
import { SelectValueAccessor } from './directives/control-value-accessors/select-value-accessor';
import { TextValueAccessor } from './directives/control-value-accessors/text-value-accessor';
import { IonBackButtonDelegate } from './directives/navigation/ion-back-button';
import { IonRouterOutlet } from './directives/navigation/ion-router-outlet';
import { IonTabs } from './directives/navigation/ion-tabs';
import { NavDelegate } from './directives/navigation/nav-delegate';
import { RouterLinkDelegate } from './directives/navigation/router-link-delegate';
import { IonApp, IonAvatar, IonBackButton, IonBackdrop, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonChip, IonCol, IonContent, IonDatetime, IonFab, IonFabButton, IonFabList, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonListHeader, IonMenu, IonMenuButton, IonMenuToggle, IonNav, IonNavLink, IonNote, IonProgressBar, IonRadio, IonRadioGroup, IonRange, IonRefresher, IonRefresherContent, IonReorder, IonReorderGroup, IonRippleEffect, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonSkeletonText, IonSlide, IonSlides, IonSpinner, IonSplitPane, IonTabBar, IonTabButton, IonText, IonTextarea, IonThumbnail, IonTitle, IonToggle, IonToolbar } from './directives/proxies';
import { VirtualFooter } from './directives/virtual-scroll/virtual-footer';
import { VirtualHeader } from './directives/virtual-scroll/virtual-header';
import { VirtualItem } from './directives/virtual-scroll/virtual-item';
import { IonVirtualScroll } from './directives/virtual-scroll/virtual-scroll';
import { AngularDelegate } from './providers/angular-delegate';
import { ConfigToken } from './providers/config';
import { ModalController } from './providers/modal-controller';
import { PopoverController } from './providers/popover-controller';
var DECLARATIONS = [
    // proxies
    IonApp,
    IonAvatar,
    IonBackButton,
    IonBackdrop,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCheckbox,
    IonChip,
    IonCol,
    IonContent,
    IonDatetime,
    IonFab,
    IonFabButton,
    IonFabList,
    IonFooter,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonInput,
    IonItem,
    IonItemDivider,
    IonItemGroup,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
    IonNav,
    IonNavLink,
    IonNote,
    IonProgressBar,
    IonRadio,
    IonRadioGroup,
    IonRange,
    IonRefresher,
    IonRefresherContent,
    IonReorder,
    IonReorderGroup,
    IonRippleEffect,
    IonRow,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonSkeletonText,
    IonSlide,
    IonSlides,
    IonSpinner,
    IonSplitPane,
    IonTabBar,
    IonTabButton,
    IonText,
    IonTextarea,
    IonThumbnail,
    IonToggle,
    IonToolbar,
    IonTitle,
    IonTabs,
    // ngModel accessors
    BooleanValueAccessor,
    NumericValueAccessor,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor,
    // navigation
    IonRouterOutlet,
    IonBackButtonDelegate,
    NavDelegate,
    RouterLinkDelegate,
    // virtual scroll
    VirtualFooter,
    VirtualHeader,
    VirtualItem,
    IonVirtualScroll
];
var IonicModule = /** @class */ (function () {
    function IonicModule() {
    }
    IonicModule_1 = IonicModule;
    IonicModule.forRoot = function (config) {
        return {
            ngModule: IonicModule_1,
            providers: [
                {
                    provide: ConfigToken,
                    useValue: config
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: appInitialize,
                    multi: true,
                    deps: [
                        ConfigToken,
                        DOCUMENT,
                        NgZone
                    ]
                }
            ]
        };
    };
    var IonicModule_1;
    IonicModule = IonicModule_1 = tslib_1.__decorate([
        NgModule({
            declarations: DECLARATIONS,
            exports: DECLARATIONS,
            providers: [AngularDelegate, ModalController, PopoverController],
            imports: [CommonModule]
        })
    ], IonicModule);
    return IonicModule;
}());
export { IonicModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uaWMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGlvbmljL2FuZ3VsYXIvIiwic291cmNlcyI6WyJpb25pYy1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBdUIsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd2RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNkRBQTZELENBQUM7QUFDbkcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDL0YsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDakcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDN0YsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDbEYsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSx3QkFBd0IsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzM2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVuRSxJQUFNLFlBQVksR0FBRztJQUNuQixVQUFVO0lBQ1YsTUFBTTtJQUNOLFNBQVM7SUFDVCxhQUFhO0lBQ2IsV0FBVztJQUNYLFFBQVE7SUFDUixTQUFTO0lBQ1QsVUFBVTtJQUNWLE9BQU87SUFDUCxjQUFjO0lBQ2QsYUFBYTtJQUNiLGVBQWU7SUFDZixZQUFZO0lBQ1osV0FBVztJQUNYLE9BQU87SUFDUCxNQUFNO0lBQ04sVUFBVTtJQUNWLFdBQVc7SUFDWCxNQUFNO0lBQ04sWUFBWTtJQUNaLFVBQVU7SUFDVixTQUFTO0lBQ1QsT0FBTztJQUNQLFNBQVM7SUFDVCxPQUFPO0lBQ1AsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQix3QkFBd0I7SUFDeEIsUUFBUTtJQUNSLE9BQU87SUFDUCxjQUFjO0lBQ2QsWUFBWTtJQUNaLGFBQWE7SUFDYixjQUFjO0lBQ2QsY0FBYztJQUNkLFFBQVE7SUFDUixPQUFPO0lBQ1AsYUFBYTtJQUNiLE9BQU87SUFDUCxhQUFhO0lBQ2IsYUFBYTtJQUNiLE1BQU07SUFDTixVQUFVO0lBQ1YsT0FBTztJQUNQLGNBQWM7SUFDZCxRQUFRO0lBQ1IsYUFBYTtJQUNiLFFBQVE7SUFDUixZQUFZO0lBQ1osbUJBQW1CO0lBQ25CLFVBQVU7SUFDVixlQUFlO0lBQ2YsZUFBZTtJQUNmLE1BQU07SUFDTixZQUFZO0lBQ1osVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixTQUFTO0lBQ1QsZUFBZTtJQUNmLGVBQWU7SUFDZixRQUFRO0lBQ1IsU0FBUztJQUNULFVBQVU7SUFDVixZQUFZO0lBQ1osU0FBUztJQUNULFlBQVk7SUFDWixPQUFPO0lBQ1AsV0FBVztJQUNYLFlBQVk7SUFDWixTQUFTO0lBQ1QsVUFBVTtJQUNWLFFBQVE7SUFFUixPQUFPO0lBRVAsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixvQkFBb0I7SUFDcEIsa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixpQkFBaUI7SUFFakIsYUFBYTtJQUNiLGVBQWU7SUFDZixxQkFBcUI7SUFDckIsV0FBVztJQUNYLGtCQUFrQjtJQUVsQixpQkFBaUI7SUFDakIsYUFBYTtJQUNiLGFBQWE7SUFDYixXQUFXO0lBQ1gsZ0JBQWdCO0NBQ2pCLENBQUM7QUFRRjtJQUFBO0lBc0JBLENBQUM7b0JBdEJZLFdBQVc7SUFDZixtQkFBTyxHQUFkLFVBQWUsTUFBb0I7UUFDakMsT0FBTztZQUNMLFFBQVEsRUFBRSxhQUFXO1lBQ3JCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsV0FBVztvQkFDcEIsUUFBUSxFQUFFLE1BQU07aUJBQ2pCO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsYUFBYTtvQkFDekIsS0FBSyxFQUFFLElBQUk7b0JBQ1gsSUFBSSxFQUFFO3dCQUNKLFdBQVc7d0JBQ1gsUUFBUTt3QkFDUixNQUFNO3FCQUNQO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7SUFyQlUsV0FBVztRQU52QixRQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsWUFBWTtZQUMxQixPQUFPLEVBQUUsWUFBWTtZQUNyQixTQUFTLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixDQUFDO1lBQ2hFLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN4QixDQUFDO09BQ1csV0FBVyxDQXNCdkI7SUFBRCxrQkFBQztDQUFBLEFBdEJELElBc0JDO1NBdEJZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFQUF9JTklUSUFMSVpFUiwgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSW9uaWNDb25maWcgfSBmcm9tICdAaW9uaWMvY29yZSc7XG5cbmltcG9ydCB7IGFwcEluaXRpYWxpemUgfSBmcm9tICcuL2FwcC1pbml0aWFsaXplJztcbmltcG9ydCB7IEJvb2xlYW5WYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2NvbnRyb2wtdmFsdWUtYWNjZXNzb3JzL2Jvb2xlYW4tdmFsdWUtYWNjZXNzb3InO1xuaW1wb3J0IHsgTnVtZXJpY1ZhbHVlQWNjZXNzb3IgfSBmcm9tICcuL2RpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvbnVtZXJpYy12YWx1ZS1hY2Nlc3Nzb3InO1xuaW1wb3J0IHsgUmFkaW9WYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2NvbnRyb2wtdmFsdWUtYWNjZXNzb3JzL3JhZGlvLXZhbHVlLWFjY2Vzc29yJztcbmltcG9ydCB7IFNlbGVjdFZhbHVlQWNjZXNzb3IgfSBmcm9tICcuL2RpcmVjdGl2ZXMvY29udHJvbC12YWx1ZS1hY2Nlc3NvcnMvc2VsZWN0LXZhbHVlLWFjY2Vzc29yJztcbmltcG9ydCB7IFRleHRWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2NvbnRyb2wtdmFsdWUtYWNjZXNzb3JzL3RleHQtdmFsdWUtYWNjZXNzb3InO1xuaW1wb3J0IHsgSW9uQmFja0J1dHRvbkRlbGVnYXRlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL25hdmlnYXRpb24vaW9uLWJhY2stYnV0dG9uJztcbmltcG9ydCB7IElvblJvdXRlck91dGxldCB9IGZyb20gJy4vZGlyZWN0aXZlcy9uYXZpZ2F0aW9uL2lvbi1yb3V0ZXItb3V0bGV0JztcbmltcG9ydCB7IElvblRhYnMgfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmF2aWdhdGlvbi9pb24tdGFicyc7XG5pbXBvcnQgeyBOYXZEZWxlZ2F0ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9uYXZpZ2F0aW9uL25hdi1kZWxlZ2F0ZSc7XG5pbXBvcnQgeyBSb3V0ZXJMaW5rRGVsZWdhdGUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmF2aWdhdGlvbi9yb3V0ZXItbGluay1kZWxlZ2F0ZSc7XG5pbXBvcnQgeyBJb25BcHAsIElvbkF2YXRhciwgSW9uQmFja0J1dHRvbiwgSW9uQmFja2Ryb3AsIElvbkJhZGdlLCBJb25CdXR0b24sIElvbkJ1dHRvbnMsIElvbkNhcmQsIElvbkNhcmRDb250ZW50LCBJb25DYXJkSGVhZGVyLCBJb25DYXJkU3VidGl0bGUsIElvbkNhcmRUaXRsZSwgSW9uQ2hlY2tib3gsIElvbkNoaXAsIElvbkNvbCwgSW9uQ29udGVudCwgSW9uRGF0ZXRpbWUsIElvbkZhYiwgSW9uRmFiQnV0dG9uLCBJb25GYWJMaXN0LCBJb25Gb290ZXIsIElvbkdyaWQsIElvbkhlYWRlciwgSW9uSWNvbiwgSW9uSW1nLCBJb25JbmZpbml0ZVNjcm9sbCwgSW9uSW5maW5pdGVTY3JvbGxDb250ZW50LCBJb25JbnB1dCwgSW9uSXRlbSwgSW9uSXRlbURpdmlkZXIsIElvbkl0ZW1Hcm91cCwgSW9uSXRlbU9wdGlvbiwgSW9uSXRlbU9wdGlvbnMsIElvbkl0ZW1TbGlkaW5nLCBJb25MYWJlbCwgSW9uTGlzdCwgSW9uTGlzdEhlYWRlciwgSW9uTWVudSwgSW9uTWVudUJ1dHRvbiwgSW9uTWVudVRvZ2dsZSwgSW9uTmF2LCBJb25OYXZMaW5rLCBJb25Ob3RlLCBJb25Qcm9ncmVzc0JhciwgSW9uUmFkaW8sIElvblJhZGlvR3JvdXAsIElvblJhbmdlLCBJb25SZWZyZXNoZXIsIElvblJlZnJlc2hlckNvbnRlbnQsIElvblJlb3JkZXIsIElvblJlb3JkZXJHcm91cCwgSW9uUmlwcGxlRWZmZWN0LCBJb25Sb3csIElvblNlYXJjaGJhciwgSW9uU2VnbWVudCwgSW9uU2VnbWVudEJ1dHRvbiwgSW9uU2VsZWN0LCBJb25TZWxlY3RPcHRpb24sIElvblNrZWxldG9uVGV4dCwgSW9uU2xpZGUsIElvblNsaWRlcywgSW9uU3Bpbm5lciwgSW9uU3BsaXRQYW5lLCBJb25UYWJCYXIsIElvblRhYkJ1dHRvbiwgSW9uVGV4dCwgSW9uVGV4dGFyZWEsIElvblRodW1ibmFpbCwgSW9uVGl0bGUsIElvblRvZ2dsZSwgSW9uVG9vbGJhciB9IGZyb20gJy4vZGlyZWN0aXZlcy9wcm94aWVzJztcbmltcG9ydCB7IFZpcnR1YWxGb290ZXIgfSBmcm9tICcuL2RpcmVjdGl2ZXMvdmlydHVhbC1zY3JvbGwvdmlydHVhbC1mb290ZXInO1xuaW1wb3J0IHsgVmlydHVhbEhlYWRlciB9IGZyb20gJy4vZGlyZWN0aXZlcy92aXJ0dWFsLXNjcm9sbC92aXJ0dWFsLWhlYWRlcic7XG5pbXBvcnQgeyBWaXJ0dWFsSXRlbSB9IGZyb20gJy4vZGlyZWN0aXZlcy92aXJ0dWFsLXNjcm9sbC92aXJ0dWFsLWl0ZW0nO1xuaW1wb3J0IHsgSW9uVmlydHVhbFNjcm9sbCB9IGZyb20gJy4vZGlyZWN0aXZlcy92aXJ0dWFsLXNjcm9sbC92aXJ0dWFsLXNjcm9sbCc7XG5pbXBvcnQgeyBBbmd1bGFyRGVsZWdhdGUgfSBmcm9tICcuL3Byb3ZpZGVycy9hbmd1bGFyLWRlbGVnYXRlJztcbmltcG9ydCB7IENvbmZpZ1Rva2VuIH0gZnJvbSAnLi9wcm92aWRlcnMvY29uZmlnJztcbmltcG9ydCB7IE1vZGFsQ29udHJvbGxlciB9IGZyb20gJy4vcHJvdmlkZXJzL21vZGFsLWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgUG9wb3ZlckNvbnRyb2xsZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9wb3BvdmVyLWNvbnRyb2xsZXInO1xuXG5jb25zdCBERUNMQVJBVElPTlMgPSBbXG4gIC8vIHByb3hpZXNcbiAgSW9uQXBwLFxuICBJb25BdmF0YXIsXG4gIElvbkJhY2tCdXR0b24sXG4gIElvbkJhY2tkcm9wLFxuICBJb25CYWRnZSxcbiAgSW9uQnV0dG9uLFxuICBJb25CdXR0b25zLFxuICBJb25DYXJkLFxuICBJb25DYXJkQ29udGVudCxcbiAgSW9uQ2FyZEhlYWRlcixcbiAgSW9uQ2FyZFN1YnRpdGxlLFxuICBJb25DYXJkVGl0bGUsXG4gIElvbkNoZWNrYm94LFxuICBJb25DaGlwLFxuICBJb25Db2wsXG4gIElvbkNvbnRlbnQsXG4gIElvbkRhdGV0aW1lLFxuICBJb25GYWIsXG4gIElvbkZhYkJ1dHRvbixcbiAgSW9uRmFiTGlzdCxcbiAgSW9uRm9vdGVyLFxuICBJb25HcmlkLFxuICBJb25IZWFkZXIsXG4gIElvbkljb24sXG4gIElvbkltZyxcbiAgSW9uSW5maW5pdGVTY3JvbGwsXG4gIElvbkluZmluaXRlU2Nyb2xsQ29udGVudCxcbiAgSW9uSW5wdXQsXG4gIElvbkl0ZW0sXG4gIElvbkl0ZW1EaXZpZGVyLFxuICBJb25JdGVtR3JvdXAsXG4gIElvbkl0ZW1PcHRpb24sXG4gIElvbkl0ZW1PcHRpb25zLFxuICBJb25JdGVtU2xpZGluZyxcbiAgSW9uTGFiZWwsXG4gIElvbkxpc3QsXG4gIElvbkxpc3RIZWFkZXIsXG4gIElvbk1lbnUsXG4gIElvbk1lbnVCdXR0b24sXG4gIElvbk1lbnVUb2dnbGUsXG4gIElvbk5hdixcbiAgSW9uTmF2TGluayxcbiAgSW9uTm90ZSxcbiAgSW9uUHJvZ3Jlc3NCYXIsXG4gIElvblJhZGlvLFxuICBJb25SYWRpb0dyb3VwLFxuICBJb25SYW5nZSxcbiAgSW9uUmVmcmVzaGVyLFxuICBJb25SZWZyZXNoZXJDb250ZW50LFxuICBJb25SZW9yZGVyLFxuICBJb25SZW9yZGVyR3JvdXAsXG4gIElvblJpcHBsZUVmZmVjdCxcbiAgSW9uUm93LFxuICBJb25TZWFyY2hiYXIsXG4gIElvblNlZ21lbnQsXG4gIElvblNlZ21lbnRCdXR0b24sXG4gIElvblNlbGVjdCxcbiAgSW9uU2VsZWN0T3B0aW9uLFxuICBJb25Ta2VsZXRvblRleHQsXG4gIElvblNsaWRlLFxuICBJb25TbGlkZXMsXG4gIElvblNwaW5uZXIsXG4gIElvblNwbGl0UGFuZSxcbiAgSW9uVGFiQmFyLFxuICBJb25UYWJCdXR0b24sXG4gIElvblRleHQsXG4gIElvblRleHRhcmVhLFxuICBJb25UaHVtYm5haWwsXG4gIElvblRvZ2dsZSxcbiAgSW9uVG9vbGJhcixcbiAgSW9uVGl0bGUsXG5cbiAgSW9uVGFicyxcblxuICAvLyBuZ01vZGVsIGFjY2Vzc29yc1xuICBCb29sZWFuVmFsdWVBY2Nlc3NvcixcbiAgTnVtZXJpY1ZhbHVlQWNjZXNzb3IsXG4gIFJhZGlvVmFsdWVBY2Nlc3NvcixcbiAgU2VsZWN0VmFsdWVBY2Nlc3NvcixcbiAgVGV4dFZhbHVlQWNjZXNzb3IsXG5cbiAgLy8gbmF2aWdhdGlvblxuICBJb25Sb3V0ZXJPdXRsZXQsXG4gIElvbkJhY2tCdXR0b25EZWxlZ2F0ZSxcbiAgTmF2RGVsZWdhdGUsXG4gIFJvdXRlckxpbmtEZWxlZ2F0ZSxcblxuICAvLyB2aXJ0dWFsIHNjcm9sbFxuICBWaXJ0dWFsRm9vdGVyLFxuICBWaXJ0dWFsSGVhZGVyLFxuICBWaXJ0dWFsSXRlbSxcbiAgSW9uVmlydHVhbFNjcm9sbFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBERUNMQVJBVElPTlMsXG4gIGV4cG9ydHM6IERFQ0xBUkFUSU9OUyxcbiAgcHJvdmlkZXJzOiBbQW5ndWxhckRlbGVnYXRlLCBNb2RhbENvbnRyb2xsZXIsIFBvcG92ZXJDb250cm9sbGVyXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSW9uaWNNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc/OiBJb25pY0NvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8SW9uaWNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IElvbmljTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBDb25maWdUb2tlbixcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXG4gICAgICAgICAgdXNlRmFjdG9yeTogYXBwSW5pdGlhbGl6ZSxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICBkZXBzOiBbXG4gICAgICAgICAgICBDb25maWdUb2tlbixcbiAgICAgICAgICAgIERPQ1VNRU5ULFxuICAgICAgICAgICAgTmdab25lXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19