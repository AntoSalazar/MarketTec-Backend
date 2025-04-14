marketec-backend/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── README.md
├── docs/
│   ├── api/
│   │   ├── API_ENDPOINTS.md
│   │   ├── auth/
│   │   ├── user/
│   │   ├── product/
│   │   ├── conversation/
│   │   ├── transaction/
│   │   ├── cart/
│   │   └── payment/
│   └── database/
│       ├── diagrams/
│       └── DataBase_Documentation.md
├── src/
│   ├── api/                          # Adapters (primary)
│   │   ├── controllers/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── campus/
│   │   │   ├── product/
│   │   │   ├── category/
│   │   │   ├── conversation/
│   │   │   ├── transaction/
│   │   │   ├── cart/
│   │   │   ├── order/
│   │   │   ├── subscription/
│   │   │   ├── payment/
│   │   │   └── report/
│   │   ├── middlewares/
│   │   │   ├── authentication.ts
│   │   │   ├── authorization.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── fileUpload.ts
│   │   │   ├── imageProcessor.ts
│   │   │   └── requestValidator.ts
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── campus/
│   │   │   ├── product/
│   │   │   ├── category/
│   │   │   ├── conversation/
│   │   │   ├── transaction/
│   │   │   ├── cart/
│   │   │   ├── order/
│   │   │   ├── subscription/
│   │   │   ├── payment/
│   │   │   └── report/
│   │   └── validators/
│   │       ├── auth/
│   │       ├── user/
│   │       ├── product/
│   │       └── cart/
│   ├── application/                  # Application layer (use cases)
│   │   └── services/
│   │       ├── auth/
│   │       ├── user/
│   │       ├── campus/
│   │       ├── product/
│   │       ├── category/
│   │       ├── conversation/
│   │       ├── transaction/
│   │       ├── cart/
│   │       ├── order/
│   │       ├── subscription/
│   │       ├── payment/
│   │       └── report/
│   ├── domain/                       # Domain layer (business logic)
│   │   ├── dtos/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── campus/
│   │   │   ├── product/
│   │   │   ├── conversation/
│   │   │   ├── transaction/
│   │   │   ├── cart/
│   │   │   ├── order/
│   │   │   ├── subscription/
│   │   │   └── payment/
│   │   ├── entities/
│   │   │   ├── user/
│   │   │   │   ├── User.entity.ts
│   │   │   │   └── AuthToken.entity.ts
│   │   │   ├── campus/
│   │   │   │   └── Campus.entity.ts
│   │   │   ├── product/
│   │   │   │   ├── Product.entity.ts
│   │   │   │   ├── ProductImage.entity.ts
│   │   │   │   ├── Category.entity.ts
│   │   │   │   └── SavedProduct.entity.ts
│   │   │   ├── conversation/
│   │   │   │   ├── Conversation.entity.ts
│   │   │   │   └── Message.entity.ts
│   │   │   ├── transaction/
│   │   │   │   ├── Transaction.entity.ts
│   │   │   │   └── Review.entity.ts
│   │   │   ├── cart/
│   │   │   │   ├── Cart.entity.ts
│   │   │   │   └── CartItem.entity.ts
│   │   │   ├── order/
│   │   │   │   ├── OrderGroup.entity.ts
│   │   │   │   └── OrderGroupItem.entity.ts
│   │   │   ├── subscription/
│   │   │   │   ├── SubscriptionPlan.entity.ts
│   │   │   │   └── UserSubscription.entity.ts
│   │   │   ├── payment/
│   │   │   │   ├── Payment.entity.ts
│   │   │   │   ├── PaymentMethod.entity.ts
│   │   │   │   ├── CategoryFee.entity.ts
│   │   │   │   └── FeeExemption.entity.ts
│   │   │   ├── notification/
│   │   │   │   └── Notification.entity.ts
│   │   │   ├── report/
│   │   │   │   └── Report.entity.ts
│   │   │   └── promotion/
│   │   │       ├── PromotionalSlot.entity.ts
│   │   │       ├── DiscountCampaign.entity.ts
│   │   │       └── DiscountUsage.entity.ts
│   │   └── interfaces/
│   │       ├── repositories/
│   │       │   ├── IBaseRepository.ts
│   │       │   ├── user/
│   │       │   ├── campus/
│   │       │   ├── product/
│   │       │   ├── conversation/
│   │       │   ├── transaction/
│   │       │   ├── cart/
│   │       │   ├── order/
│   │       │   ├── subscription/
│   │       │   └── payment/
│   │       └── services/
│   │           ├── auth/
│   │           ├── user/
│   │           ├── campus/
│   │           ├── product/
│   │           ├── conversation/
│   │           ├── transaction/
│   │           ├── cart/
│   │           ├── order/
│   │           ├── subscription/
│   │           └── payment/
│   ├── infrastructure/               # Adapters (secondary)
│   │   ├── database/
│   │   │   ├── dataSource.ts
│   │   │   ├── migrations/
│   │   │   └── seeders/
│   │   │       ├── campusSeeder.ts
│   │   │       └── categorySeeder.ts
│   │   ├── repositories/
│   │   │   ├── TypeOrmBaseRepository.ts
│   │   │   ├── user/
│   │   │   ├── campus/
│   │   │   ├── product/
│   │   │   ├── conversation/
│   │   │   ├── transaction/
│   │   │   ├── cart/
│   │   │   ├── order/
│   │   │   ├── subscription/
│   │   │   └── payment/
│   │   ├── messaging/                # For real-time features
│   │   │   └── websocket/
│   │   └── storage/                  # For file uploads
│   │       └── cloudStorage.ts
│   ├── config/
│   │   ├── environment.ts
│   │   ├── inversify.container.ts
│   │   ├── inversify.types.ts
│   │   └── logger.ts
│   ├── utils/
│   │   ├── errors/
│   │   │   └── HttpException.ts
│   │   └── helpers/
│   │       ├── fileHelper.ts
│   │       ├── passwordHelper.ts
│   │       └── tokenHelper.ts
│   └── server.ts
└── uploads/                          #