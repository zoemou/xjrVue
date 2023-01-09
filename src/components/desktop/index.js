import i18n from "@/lang";
export default [
    {
        title:i18n.t('basicComp'),
        list:[
            {
                type: 'databoard',
                label: i18n.t('dataPanel'),
                icon: 'el-icon-price-tag',
                w: 6,
                h: 2,
                minW: 3,
                minH: 2,
                maxW: 12,
                //maxH: 2,

                color:'rgba(103, 194, 58, 1)',
				bgColor:'rgba(225, 243, 215, 1)',
                moduleId:'',
                dataCode:'',
                dataValueKey:'',
				sourceType:'dataSource',
				computeType:'',
				unit:''
            }
            ,{
                type: 'datalist',
                label: i18n.t('inforList'),
                icon: 'fa fa-list-alt',

                w: 6,
                h: 4,
                minW: 3,
                minH: 2,
                maxW: 12,
                //maxH: 12,

                moduleId:'',
				viewForm:'',
                formVerison:'',
                orderId:'',
                limitRow:0,
                maxRows:10,

                columns:[]
            },
			{
				type:'menu',
				label:i18n.t('shortcutMenu'),
				icon: 'fa fa-list-alt',
				
				w: 3,
				h: 3,
				minW: 3,
				minH: 3,
				maxW: 12,
				//maxH: 3,
				
				columns:[{
					id:0,
					name:i18n.t('workFlow.Step1.labelMName'),
					icon: 'el-icon-s-check',
					color:'#e6a23c',
					bgColor:'#faecd8',
					moduleId:'',
					orderId:0
				}]
			}
        ]
    }
    ,{
        title:i18n.t('chartComp'),
        list:[
            {
                type: 'chartbar',
                label: i18n.t('mobileDev.homeRightSide.bar'),
                icon: 'el-icon-s-data',
                w: 6,
                h: 6,
                minW: 3,
                minH: 3,
                maxW: 12,
                //maxH: 20,

                showBackground:false,
                backgroundColor:'',

                sourceType:'dataSource',
				dataCode:'',
                dataType:'Y',
                YKey:'',
                XKey:'',

            }
            ,{
                type: 'chartline',
                label: i18n.t('BI.echart.line'),
                icon: 'fa fa-line-chart',
                w: 6,
                h: 6,
                minW: 3,
                minH: 3,
                maxW: 12,
                //maxH: 20,

                sourceType:'dataSource',
				dataCode:'',
                dataType:'Y',
                YKey:'',
                XKey:'',

            }
            ,{
                type: 'chartpie',
                label: i18n.t('BI.echart.pie'),
                icon: 'el-icon-pie-chart',
                w: 6,
                h: 6,
                minW: 3,
                minH: 3,
                maxW: 12,
                //maxH: 20,

                sourceType:'dataSource',
				dataCode:'',
                nameKey:'',
                valueKey:'',

            }
            ,{
                type: 'chartradar',
                label: i18n.t('BI.echart.radar'),
                icon: 'fa fa-first-order',
                w: 6,
                h: 6,
                minW: 3,
                minH: 3,
                maxW: 12,
                //maxH: 20,
				
				sourceType:'dataSource',
				dataCode:'',
				nameKey:'',
                dataValueKey:'',
				columns:[]
            }
            ,{
                type: 'chartgauge',
                label: i18n.t('BI.echart.gauge'),
                icon: 'fa fa-tachometer',
                w: 6,
                h: 6,
                minW: 3,
                minH: 3,
                maxW: 12,
                //maxH: 20,
				sourceType:'dataSource',
				dataCode:'',
				nameKey:'',
				dataValueKey:''
            }
            
        ]
    }
    ,{
        title:i18n.t('systemComp'),
        list:[
            {
                type: 'mytask',
                label: i18n.t('workFlow.Process.myTask'),
                icon: 'fa fa-tasks',
                w: 12,
                h: 3,
                minW: 3,
                minH: 3,
                maxW: 12,
                //maxH: 3,
				
				sicon: 'el-icon-s-check',
				scolor:'#e6a23c',
				sbgColor:'#faecd8',
				ficon: 'el-icon-s-custom',
				fcolor:'#409eff',
				fbgColor:'#ecf5ff',
				ticon: 'el-icon-finished',
				tcolor:'#f56c6c',
				tbgColor:'#fde2e2',
            }
            ,{
                type: 'mytasklist',
                label: i18n.t('Schedule'),
                icon: 'el-icon-s-order',

                w: 12,
                h: 4,
                minW: 3,
                minH: 3,
                maxW: 12,
                //maxH: 12,
				
				maxNum:10
            }
            ,{
                type: 'modules',
                label:i18n.t('newsCenter'),
				interfaceUrl:'news',
                icon: 'el-icon-receiving',

                w: 12,
                h: 3,
                minW: 2,
                minH: 3,
                maxW: 12,
                //maxH: 0,
				
				moduleId:JSON.stringify({id:'0',url:'/office-automation/news'}),
				orderField:'F_ReleaseTime',
				maxRows:10,
				wrap:false,
				options:[{value:'F_ReleaseTime',label:i18n.t('Notice.labelReleaTime')},{value:'F_FullHead',label:i18n.t('News.tabNewsTitle')},{value:'F_CategoryId',label:i18n.t('News.labelNewsSection')},{value:'F_AuthorName',label:i18n.t('News.labelWriter')}],
				column: [{label:i18n.t('News.tabNewsTitle'), prop: 'F_FullHead',sortable: true},
				        {label:i18n.t('News.labelNewsSection'), prop: 'F_CategoryId',sortable: true},
						{label:i18n.t('Notice.labelReleaTime'), prop: 'F_ReleaseTime',sortable: true},
				        {label:i18n.t('News.labelWriter'), prop:'F_AuthorName',sortable: true} 
				        // ,{label:i18n.t('Notice.labelContent'), prop: 'F_NewsContent',align:'left',sortable: true}
						]
            },{
                type: 'modules',
                label: i18n.t('Notice'),
				interfaceUrl:'notice',
                icon: 'el-icon-receiving',

                w: 12,
                h: 3,
                minW: 2,
                minH: 3,
                maxW: 12,
                //maxH: 3,
				
				moduleId:JSON.stringify({id:'0',url:'/office-automation/notice'}),
				orderField:'F_ReleaseTime',
				maxRows:10,
				wrap:false,
				options:[{value:'F_ReleaseTime',label:i18n.t('Notice.labelReleaTime')},{value:'F_FullHead',label:i18n.t('Notice.labelNotTitle')},{value:'F_CategoryId',label:i18n.t('Notice.labelNotTyle')},{value:'F_SourceName',label:i18n.t('Notice.labelInforSou')}],
				column: [{label:i18n.t('Notice.labelNotTitle'), prop: 'F_FullHead',sortable: true},
				        {label:i18n.t('Notice.labelNotTyle'), prop: 'F_CategoryId',sortable: true},
						{label:i18n.t('Notice.labelReleaTime'), prop: 'F_ReleaseTime',sortable: true},
				        {label:i18n.t('Notice.labelInforSou'), prop:'F_SourceName',sortable: true}
				        //,{label:i18n.t('Notice.labelContent'), prop: 'F_NewsContent',align:'left',sortable: true}
						]
            }
        ]
    }
	,{
	    title:i18n.t('erpComp'),
	    list:[
	        {
				type: 'modules',
				label: i18n.t('purchaseApply'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'erp_purchaserequsetinfo2',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/purchaseManage/erp_purchaserequsetinfo'}),
				orderField:'F_DocumentDate',
				maxRows:10,
				wrap:false,
				options:[{value:'F_DocunNumber',label:i18n.t('receiptNum')},{value:'F_DeliveryUnit',label:i18n.t('supplier')},
				{value:'F_DocumentDate',label:i18n.t('billDate')},{value:'F_ApplicationPurposes',label:i18n.t('application')},{value:'F_ChargePeople',label:i18n.t('handler')},
				{value:'F_Emergencylevel',label:i18n.t('urgencyDegree')},{value:'F_DeliveryDate',label:i18n.t('deliveryDate')},{value:'F_DocumentStatus',label:i18n.t('auditStatus')}],
				column: [{label:i18n.t('receiptNum'), prop: 'F_DocunNumber',sortable: true},
				        {label:i18n.t('supplier'), prop: 'F_DeliveryUnit',sortable: true},
						{label:i18n.t('billDate'), prop: 'F_DocumentDate',sortable: true},
				        {label:i18n.t('application'), prop:'F_ApplicationPurposes',sortable: true}, 
				        {label:i18n.t('handler'), prop: 'F_ChargePeople',sortable: true},
						{label:i18n.t('urgencyDegree'), prop: 'F_Emergencylevel',sortable: true},
						{label:i18n.t('deliveryDate'), prop: 'F_DeliveryDate',sortable: true},
						{label:i18n.t('auditStatus'), prop: 'F_DocumentStatus',sortable: true},
						{label:i18n.t('orgUserManagement.tabRemark'), prop: 'F_Description',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label:i18n.t('salesOrder'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'erp_salesorder',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/SalesManage/erp_salesorder'}),
				orderField:'F_Orderdate',
				maxRows:10,
				wrap:false,
				options:[{value:'F_SalesCode',label:i18n.t('documentCode')},{value:'F_ClientId',label:i18n.t('customerName')},
				{value:'F_Orderdate',label:i18n.t('orderDate')},{value:'F_DeliveryDate',label:i18n.t('deliveryDate')},{value:'F_SalesType',label:i18n.t('salesType')},
				{value:'F_SalesPersonId',label:i18n.t('salesperson')},{value:'F_PaymentMethod',label:i18n.t('paymentWay')}],
				column: [{label:i18n.t('documentCode'), prop: 'F_SalesCode',sortable: true},
				        {label:i18n.t('customerName'), prop: 'F_ClientId',sortable: true},
						{label:i18n.t('orderDate'), prop: 'F_Orderdate',sortable: true},
				        {label:i18n.t('deliveryDate'), prop:'F_DeliveryDate',sortable: true}, 
				        {label:i18n.t('salesType'), prop: 'F_SalesType',sortable: true},
						{label:i18n.t('salesperson'), prop: 'F_SalesPersonId',sortable: true},
						{label:i18n.t('paymentWay'), prop: 'F_PaymentMethod',sortable: true},
						{label:i18n.t('orgUserManagement.tabRemark'), prop: 'F_Description',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label: i18n.t('stockManage'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'erp_instock',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/StockManage/erp_instock'}),
				orderField:'F_InStockDate',
				maxRows:10,
				wrap:false,
				options:[{value:'F_InStockCode',label:i18n.t('warehouseNum')},{value:'F_WarehouseId',label:i18n.t('warehouse')},
				{value:'F_InStockDate',label:i18n.t('inboundDate')},{value:'F_InvalidMark',label:i18n.t('documentStatus')}],
				column: [{label:i18n.t('warehouseNum'), prop: 'F_InStockCode',sortable: true},
				        {label:i18n.t('warehouse'), prop: 'F_WarehouseId',sortable: true},
						{label:i18n.t('inboundDate'), prop: 'F_InStockDate',sortable: true},
				        {label:i18n.t('documentStatus'), prop:'F_InvalidMark',sortable: true}, 
						{label:i18n.t('orgUserManagement.tabRemark'), prop: 'F_Description',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label: i18n.t('whseMgt'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'erp_outstock',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/StockManage/erp_outstock'}),
				orderField:'F_OutStockDate',
				maxRows:10,
				wrap:false,
				options:[{value:'F_OutStockCode',label:i18n.t('whseNumber')},{value:'F_WarehouseId',label:i18n.t('outboundWhse')},
				{value:'F_OutStockDate',label:i18n.t('outboundDate')},{value:'F_InvalidMark',label:i18n.t('documentStatus')}],
				column: [{label:i18n.t('whseNumber'), prop: 'F_OutStockCode',sortable: true},
				        {label:i18n.t('outboundWhse'), prop: 'F_WarehouseId',sortable: true},
						{label:i18n.t('outboundDate'), prop: 'F_OutStockDate',sortable: true},
				        {label:i18n.t('documentStatus'), prop:'F_InvalidMark',sortable: true}, 
						{label:i18n.t('orgUserManagement.tabRemark'), prop: 'F_Description',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label: i18n.t('paymentMgt'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'erp_financepayment',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/ERP财务管理/erp_financepayment'}),
				orderField:'F_PaymentDate',
				maxRows:10,
				wrap:false,
				options:[{value:'F_PaymentCode',label:i18n.t('paymentNum')},{value:'F_PaymentDate',label:i18n.t('paymentDate')},
				{value:'F_PurchaseOrderId',label:i18n.t('purchaseOrderNo')},{value:'F_DeliveryUnit',label:i18n.t('supplier')},{value:'F_TotalPurchases',label:i18n.t('totalPur')},
				{value:'F_UnsoldAmount',label:i18n.t('unsoldAmount')},{value:'F_SalesAmount',label:i18n.t('amountSold')}],
				column: [{label:i18n.t('paymentNum'), prop: 'F_PaymentCode',sortable: true},
				        {label:i18n.t('paymentDate'), prop: 'F_PaymentDate',sortable: true},
						{label:i18n.t('purchaseOrderNo'), prop: 'F_PurchaseOrderId',sortable: true},
				        {label:i18n.t('supplier'), prop:'F_DeliveryUnit',sortable: true},
						{label:i18n.t('totalPur'), prop: 'F_TotalPurchases',sortable: true},
						{label:i18n.t('unsoldAmount'), prop: 'F_UnsoldAmount',sortable: true},
						{label:i18n.t('amountSold'), prop: 'F_SalesAmount',sortable: true},
						{label:i18n.t('orgUserManagement.tabRemark'), prop: 'F_Description',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label: i18n.t('creditMgt'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'erp_financereceipt',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/ERP财务管理/erp_financereceipt'}),
				orderField:'F_InvoiceDate',
				maxRows:10,
				wrap:false,
				options:[{value:'F_ReceiptCode',label:i18n.t('receiptNumber')},{value:'F_InvoiceDate',label:i18n.t('receiptDate')},
				{value:'F_PurchaseOrderId',label:i18n.t('salesOrder')},{value:'F_ClientId',label:i18n.t('customerName')},{value:'F_DocumentAmount',label:i18n.t('docAmount')},
				{value:'F_UnsoldAmount',label:i18n.t('unsoldAmount')},{value:'F_SalesAmount',label:i18n.t('amountSold')}],
				column: [{label:i18n.t('receiptNumber'), prop: 'F_ReceiptCode',sortable: true},
				        {label:i18n.t('receiptDate'), prop: 'F_InvoiceDate',sortable: true},
						{label:i18n.t('salesOrder'), prop: 'F_PurchaseOrderId',sortable: true},
				        {label:i18n.t('customerName'), prop:'F_ClientId',sortable: true},
						{label:i18n.t('docAmount'), prop: 'F_DocumentAmount',sortable: true},
						{label:i18n.t('unsoldAmount'), prop: 'F_UnsoldAmount',sortable: true},
						{label:i18n.t('amountSold'), prop: 'F_SalesAmount',sortable: true},
						{label:i18n.t('orgUserManagement.tabRemark'), prop: 'F_Description',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label: i18n.t('purOverview'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'data-sources/5f203ee4f87559a8ebe3b4bef47ab868/data-page',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/ReportsManage/PurchaseReport/采购总览表'}),
				orderField:'',
				maxRows:10,
				wrap:false,
				options:[{value:'F_PurchaseOrder',label:i18n.t('purchaseOrderNo')},{value:'F_DeliveryUnit',label:i18n.t('supplier')},
				{value:'F_PurchaseDate',label:i18n.t('purchaseDate')},{value:'F_PurchaseType',label:i18n.t('purchaseType')},{value:'F_PurchasePeople',label:i18n.t('buyer')},
				{value:'F_Status',label:i18n.t('orderStatus')},{value:'F_GoodsName',label:i18n.t('productName')},{value:'F_GoodCode',label:i18n.t('productCode')}
				,{value:'F_Specs',label:i18n.t('specification')}],
				column: [{label:i18n.t('purchaseOrderNo'), prop: 'F_PurchaseOrder',sortable: true},
				        {label:i18n.t('supplier'), prop: 'F_DeliveryUnit',sortable: true},
						{label:i18n.t('purchaseDate'), prop: 'F_PurchaseDate',sortable: true},
				        {label:i18n.t('purchaseType'), prop:'F_PurchaseType',sortable: true},
						{label:i18n.t('buyer'), prop: 'F_PurchasePeople',sortable: true},
						{label:i18n.t('orderStatus'), prop: 'F_Status',sortable: true},
						{label:i18n.t('productName'), prop: 'F_GoodsName',sortable: true},
						{label:i18n.t('productCode'), prop: 'F_GoodCode',sortable: true},
						{label:i18n.t('specification'), prop: 'F_Specs',sortable: true},
						{label:i18n.t('orgUserManagement.tabRemark'), prop: 'F_Des',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label: i18n.t('salesOverview'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'data-sources/b1bed2b19e40b1ad5be50590c323bd56/data-page',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/SalesManage/salesorder'}),
				orderField:'',
				maxRows:10,
				wrap:false,
				options:[{value:'F_SalesCode',label:i18n.t('SaleNo')},{value:'F_ClientName',label:i18n.t('customerName')},
				{value:'F_DeliveryDate',label:i18n.t('deliveryDate')},{value:'F_SalesType',label:i18n.t('salesType')},{value:'F_SalesPersonId',label:i18n.t('salesperson')},
				{value:'F_PaymentMethod',label:i18n.t('paymentWay')},{value:'F_DiscountedPrice',label:i18n.t('discountAmount')},
				{value:'F_Turnover',label:i18n.t('turnover')},{value:'F_GoodsName',label:i18n.t('productName')}],
				column: [{label:i18n.t('SaleNo'), prop: 'F_SalesCode',sortable: true},
				        {label:i18n.t('customerName'), prop: 'F_ClientName',sortable: true},
						{label:i18n.t('deliveryDate'), prop: 'F_DeliveryDate',sortable: true},
				        {label:i18n.t('salesType'), prop:'F_SalesType',sortable: true},
						{label:i18n.t('salesperson'), prop: 'F_SalesPersonId',sortable: true},
						{label:i18n.t('paymentWay'), prop: 'F_PaymentMethod',sortable: true},
						{label:i18n.t('discountAmount'), prop: 'F_DiscountedPrice',sortable: true},
						{label:i18n.t('turnover'), prop: 'F_Turnover',sortable: true},
						{label:i18n.t('productName'), prop: 'F_GoodsName',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label: i18n.t('whseOverview'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'data-sources/05fcc49507e2b3f7b65af94cf75635e1/data-page',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/ReportsManage/StockReport/入库总览表'}),
				orderField:'',
				maxRows:10,
				wrap:false,
				options:[{value:'F_InStockCode',label:i18n.t('receiptNo')},{value:'WarehouseName',label:i18n.t('warehouse')},
				{value:'F_InStockDate',label:i18n.t('inboundDate')},{value:'F_GoodsName',label:i18n.t('productName')},{value:'F_GoodCode',label:i18n.t('productCode')}],
				column: [{label:i18n.t('receiptNo'), prop: 'F_InStockCode',sortable: true},
				        {label:i18n.t('warehouse'), prop: 'WarehouseName',sortable: true},
						{label:i18n.t('inboundDate'), prop: 'F_InStockDate',sortable: true},
				        {label:i18n.t('productName'), prop:'F_GoodsName',sortable: true},
						{label:i18n.t('productCode'), prop: 'F_GoodCode',sortable: true},
						{prop:'F_Quantity',label:i18n.t('orderNum'),sortable: true},
						{prop:'F_Description',label:i18n.t('orgUserManagement.tabRemark'),sortable: true}]
			},
			{
				type: 'modules',
				label:i18n.t('outboundOverview'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'data-sources/59464317210a4a1d20c116b872b051f7/data-page',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/StockManage/erp_outstock'}),
				orderField:'',
				maxRows:10,
				wrap:false,
				options:[{value:'F_OutStockCode',label:i18n.t('numberDelivery')},{value:'WarehouseName',label:i18n.t('outboundWhse')},
				{value:'F_OutStockDate',label:i18n.t('outboundDate')},{value:'F_GoodsName',label:i18n.t('productName')},{value:'F_GoodCode',label:i18n.t('productCode')},
				{value:'F_Specs',label:i18n.t('specification')},{value:'F_Unit',label:i18n.t('unit')},{value:'F_Quantity',label:i18n.t('orderNum')}],
				column: [{label:i18n.t('numberDelivery'), prop: 'F_OutStockCode',sortable: true},
				        {label:i18n.t('outboundWhse'), prop: 'WarehouseName',sortable: true},
						{label:i18n.t('outboundDate'), prop: 'F_OutStockDate',sortable: true},
				        {label:i18n.t('productName'), prop:'F_GoodsName',sortable: true},
						{label:i18n.t('productCode'), prop: 'F_GoodCode',sortable: true},
						{label:i18n.t('specification'), prop: 'F_Specs',sortable: true},
						{label:i18n.t('unit'), prop: 'F_Unit',sortable: true},
						{label:i18n.t('orderNum'), prop: 'F_Quantity',sortable: true},
						{label:i18n.t('orgUserManagement.tabRemark'), prop: 'F_Description',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label: i18n.t('collOverview'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'data-sources/5fc5a74e2c80506ee2da3308f5b7129d/data-page',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/ReportsManage/FinanceReport/财务收款总览表'}),
				orderField:'',
				maxRows:10,
				wrap:false,
				options:[{value:'F_ReceiptCode',label:i18n.t('receiptNum')},{value:'F_SalesCode',label:i18n.t('SaleNo')},
				{value:'clientName',label:i18n.t('customerName')},{value:'F_InvoiceDate',label:i18n.t('receiptDate')},{value:'F_DocumentAmount',label:i18n.t('docAmount')},
				{value:'F_UnsoldAmount',label:i18n.t('unsoldAmount')},{value:'F_SalesAmount',label:i18n.t('amountSold')},{value:'F_PaymentAmount',label:i18n.t('paymentAmount')},
				{value:'F_SettlementAccount',label:i18n.t('settleAccount')},{value:'F_BillingMethod',label:i18n.t('settleWay')},{value:'F_SettlementNumber',label:i18n.t('settlement')}],
				column: [{label:i18n.t('receiptNum'), prop: 'F_ReceiptCode',sortable: true},
				        {label:i18n.t('SaleNo'), prop: 'F_SalesCode',sortable: true},
						{label:i18n.t('customerName'), prop: 'clientName',sortable: true},
				        {label:i18n.t('receiptDate'), prop:'F_InvoiceDate',sortable: true},
						{label:i18n.t('docAmount'), prop: 'F_DocumentAmount',sortable: true},
						{label:i18n.t('unsoldAmount'), prop: 'F_UnsoldAmount',sortable: true},
						{label:i18n.t('amountSold'), prop: 'F_SalesAmount',sortable: true},
						{label:i18n.t('paymentAmount'), prop: 'F_PaymentAmount',sortable: true},
						{label:i18n.t('settleAccount'), prop: 'F_SettlementAccount',sortable: true},
						{label:i18n.t('settleWay'), prop: 'F_BillingMethod',align:'left',sortable: true},
						{label:i18n.t('settlement'), prop: 'F_SettlementNumber',align:'left',sortable: true}]
			},
			{
				type: 'modules',
				label: i18n.t('paymentOverview'),
				icon: 'el-icon-receiving',
				
				w: 12,
				h: 3,
				minW: 2,
				minH: 5,
				maxW: 12,
				
				interfaceUrl:'data-sources/74f9a99e058b5edecbead62e2db54887/data-page',
				moduleId:JSON.stringify({id:'0',url:'/office-automation/erp_model/ReportsManage/FinanceReport/财务付款总览表'}),
				orderField:'',
				maxRows:10,
				wrap:false,
				options:[{value:'F_PaymentCode',label:i18n.t('paymentNum')},
				{value:'F_PaymentDate',label:i18n.t('paymentDate')},{value:'F_TotalPurchases',label:i18n.t('totalPur')},{value:'F_UnsoldAmount',label:i18n.t('unsoldAmount')},				
				{value:'F_SalesAmount',label:i18n.t('amountSold')},{value:'F_PaymentAmount',label:i18n.t('paymentAmount')},{value:'F_Manager',label:i18n.t('salesperson')},
				{value:'F_SettlementAccount',label:i18n.t('settleAccount')},{value:'F_BillingMethod',label:i18n.t('settleWay')},{value:'F_SettlementNumber',label:i18n.t('settlement')}],
				column: [{label:i18n.t('paymentNum'), prop: 'F_PaymentCode',sortable: true},
						{label:i18n.t('paymentDate'), prop: 'F_PaymentDate',sortable: true},
				        {label:i18n.t('totalPur'), prop:'F_TotalPurchases',sortable: true},
						{label:i18n.t('unsoldAmount'), prop: 'F_UnsoldAmount',sortable: true},
						{label:i18n.t('amountSold'), prop: 'F_SalesAmount',sortable: true},
						{label:i18n.t('paymentAmount'), prop: 'F_PaymentAmount',sortable: true},
						{label:i18n.t('salesperson'), prop: 'F_Manager',sortable: true},
						{label:i18n.t('settleAccount'), prop: 'F_SettlementAccount',sortable: true},
						{label:i18n.t('settleWay'), prop: 'F_BillingMethod',align:'left',sortable: true},
						{label:i18n.t('settlement'), prop: 'F_SettlementNumber',align:'left',sortable: true}]
			},
		]
	}
]