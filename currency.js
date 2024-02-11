"use strict;"

const currencies = [
        // African currencies
        { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
        { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
        { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
        { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
        { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
        { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham' },
        { code: 'XOF', symbol: 'CFA', name: 'West African CFA franc' },
        { code: 'DZD', symbol: 'DA', name: 'Algerian Dinar' },
        { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi' },
        { code: 'BWP', symbol: 'P', name: 'Botswana Pula' },
        // Asian currencies
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
        { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
        { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
        { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
        { code: 'AED', symbol: 'د.إ', name: 'United Arab Emirates Dirham' },
        { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
        { code: 'THB', symbol: '฿', name: 'Thai Baht' },
        { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
        // European currencies
        { code: 'GBP', symbol: '£', name: 'British Pound Sterling' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
        { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
        { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
        { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
        { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
        { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
        { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
        { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
        // North American currencies
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
        { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
        { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
        { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
        { code: 'COP', symbol: '$', name: 'Colombian Peso' },
        { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
        { code: 'PEN', symbol: 'S/.', name: 'Peruvian Nuevo Sol' },
        { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal' },
        { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón' },
        // South American currencies
        { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
        { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
        { code: 'COP', symbol: '$', name: 'Colombian Peso' },
        { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
        { code: 'PEN', symbol: 'S/.', name: 'Peruvian Nuevo Sol' },
        { code: 'UYU', symbol: '$', name: 'Uruguayan Peso' },
        { code: 'VEF', symbol: 'Bs', name: 'Venezuelan Bolívar' },
        { code: 'BOB', symbol: 'Bs', name: 'Bolivian Boliviano' },
        { code: 'PYG', symbol: '₲', name: 'Paraguayan Guarani' },
        { code: 'GHS', symbol: 'GH₵', name: 'Guyanaese Dollar' },
        // Oceanian currencies (including Australia)
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
        { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
        { code: 'PGK', symbol: 'K', name: 'Papua New Guinean Kina' },
        { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar' },
        { code: 'TOP', symbol: 'T$', name: 'Tongan pa\'anga' },
        { code: 'SBD', symbol: 'SI$', name: 'Solomon Islands Dollar' },
        { code: 'VUV', symbol: 'VT', name: 'Vanuatu Vatu' },
        { code: 'WST', symbol: 'WS$', name: 'Samoan Tala' },
        { code: 'SBD', symbol: 'SI$', name: 'Solomon Islands Dollar' },
        { code: 'VUV', symbol: 'VT', name: 'Vanuatu Vatu' },    
    ];
    const currencySelect = document.getElementById('currencySelect');
    
    // Populate the dropdown with currency options
    currencies.forEach(currency => {
    const option = document.createElement('option');
    option.value = currency.code;
    option.text = `${currency.code} (${currency.symbol})`;
    currencySelect.appendChild(option);
    });


    