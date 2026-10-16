-- Seed: блюда, заготовки, связи, описания техпроцессов, эталоны ГЕ/блюдо
-- Безопасно: не затирает существующие данные (ON CONFLICT DO NOTHING)

BEGIN;

ALTER TABLE ready_food_wrappers ADD COLUMN IF NOT EXISTS process_description TEXT;

-- 108 блюд
INSERT INTO ready_food_products(id,name) VALUES(1005000,'КАФЕ Овсяная каша с ягодным соусом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293473,'КАФЕ Поке-боул с креветками и киноа (меньше огурца)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293531,'КАФЕ Галета 4 сыра') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293533,'КАФЕ Бефстроганов из томленой говядины') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293534,'КАФЕ Банана-кейк') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293546,'КАФЕ Рисовый пудинг с халвой и клубникой') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293547,'КАФЕ Омлет-ролл с кремчизом и красной рыбой') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293548,'КАФЕ Шоколадная гранола из киноа с малиной и йогуртом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293550,'КАФЕ Протеин боул (яйца, фета, эдамаме, черрри)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293551,'КАФЕ Паста Болоньезе с бедром индейки') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293573,'КАФЕ Салат Цезарь с курицей') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293619,'КАФЕ Суп Том-ям с креветками и рисом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293621,'КАФЕ Чикен-стейк с гречкой') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293625,'КАФЕ Тыквенный суп-пюре с кокосовым молоком') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1293634,'КАФЕ Шоко-кукис') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1294854,'КАФЕ Основа для "Зеленого смузи"') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1294855,'КАФЕ Основа для смузи "Ананасовый Баунти"') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1294856,'КАФЕ Основа для смузи "Клубника-Банан"') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1294857,'КАФЕ Основа для смузи "Облепиха"') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1294858,'КАФЕ Основа для смузи "Черника-Смородина"') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1294926,'КАФЕ Чикен-стейк и гречка с ароматными травами') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1294927,'КАФЕ Поке-боул с креветками и киноа') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1294929,'КАФЕ Салат Цезарь с пастрами из курицы') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1294931,'КАФЕ Поке-боул с креветками и киноа Вер2 (с апельсиновым соусом)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295007,'КАФЕ Галета 4 сыра Вер1') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295153,'КАФЕ Омлет с итальянскими травами') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295193,'КАФЕ Запеченная индейка с кускусом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295194,'КАФЕ Куриные кебабы с пряным булгуром') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295201,'КАФЕ Шашлычки Якитори с рисом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295222,'КАФЕ Сырники из натурального творога') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295229,'КАФЕ Кабачковая вафля с сыром и тунцом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295273,'КАФЕ Шоколадные кукис') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295379,'КАФЕ Брауни 4 шт х 70 г') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295466,'КАФЕ Овсяная каша с ягодным соусом (300 гр)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1295825,'КАФЕ Основа для смузи "Тайское Манго"') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1296788,'Дублировать КАФЕ Салат Цезарь с курицей') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297057,'КАФЕ Чай-лимонад с облепихой') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297305,'КАФЕ Курица Терияки с гречневой лапшой') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297306,'КАФЕ Фрикадельки с брусничным соусом и гречкой') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297307,'КАФЕ Лимонная курица с киноа') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297308,'КАФЕ Индейка с корнеплодами') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297314,'КАФЕ Оливье') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297318,'КАФЕ Овсяная каша с ягодным соусом (200 гр)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297319,'КАФЕ Рисовый крем-пудинг (125 гр)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297320,'КАФЕ Том Кха с цыпленком') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297441,'КАФЕ Тяхан (Мисо рис с курицей)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297442,'КАФЕ Курица тандури с рисом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297485,'Кафе Черный лимонад') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297503,'КАФЕ Цитрусовый чёрный лимонад') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297528,'КАФЕ Борщ с томлёной говядиной') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297537,'КАФЕ Винегрет') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297538,'КАФЕ Морковка по-корейски') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297545,'КАФЕ Морковный суп-пюре') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297546,'КАФЕ Крем-суп из шампиньонов') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297547,'КАФЕ Куриный суп-лапша') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297548,'КАФЕ Японские хэнд-роллы в нори') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297549,'КАФЕ Блинчики с начинкой Жюльен') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297550,'КАФЕ Круассан') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297874,'КАФЕ Брауни 1 шт х 70 г') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1297875,'КАФЕ Кукис') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298056,'КАФЕ Кремовый чизкейк') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298057,'КАФЕ Взбитый творог «Баноффи» (банан, карамель, брауни)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298058,'КАФЕ Творожный Тирамису') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298177,'КАФЕ Нежная курица с запечёнными овощами') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298178,'КАФЕ Котлеты из тунца с картофелем и зеленой фасолью') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298405,'КАФЕ Котлеты из белой рыбы с кускусом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298406,'Кафе Котлеты из белой рыбы с картофелем горошком и редисом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298407,'КАФЕ Зелёный птитим с курицей') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298408,'КАФЕ Паста Неаполетана с цыплёнком') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298409,'КАФЕ Лимонный мусс') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298418,'КАФЕ Фрикадельки с зелёным булгуром') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298751,'КАФЕ Гаспачо') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298752,'КАФЕ Чевапчичи и аджапсандал') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298770,'КАФЕ Шашлык из курицы с овощами гриль') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298832,'КАФЕ Поке-боул с креветками') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298835,'КАФЕ Свекольник') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298836,'КАФЕ Зелёный салат с песто') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298837,'КАФЕ Греческий салат') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298838,'КАФЕ Ролл с лососем и сливочным сыром') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298839,'КАФЕ Супер-мега-белковый ролл с курицей карри и яйцом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298865,'КАФЕ Седвич - ролл пастрами песто') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298866,'КАФЕ Яичный сендвич с ветчиной и сыром') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298965,'КАФЕ Фестиваль Шаурма') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1298966,'КАФЕ Фестиваль Шримп ролл') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299080,'КАФЕ Напиток Bursty б/а со вкусом лесных ягод, 12 шт х 500 мл/бут') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299161,'КАФЕ Малиновый соус (30 гр)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299162,'КАФЕ Сметана 15% (30 гр)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299163,'КАФЕ Томатный соус маринара (30 гр)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299164,'КАФЕ Соевый соус (25 гр)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299206,'КАФЕ Овсяная каша с клюквенным вареньем (200 гр)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299207,'КАФЕ Рисовый пудинг / с халвой и черной смородиной') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299208,'КАФЕ Боул Филадельфия') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299209,'КАФЕ Боул с креветками и брокколи') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299211,'КАФЕ Курица су-вид с рисом и соусом из шпината') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299222,'КАФЕ Бисквит протеиновый "Брауни Лимон-Чиа", 10 шт х 50 гр') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299223,'КАФЕ Бисквит протеиновый "Брауни Фисташка", 10 шт х 50 гр') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299224,'КАФЕ Бисквит протеиновый "Шоколадный брауни", 10 шт х 50 гр') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299247,'КАФЕ Салат Нисуаз с тунцом конфи') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299250,'КАФЕ Скрэмбл с лососем') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299263,'ПРОМО. Подарок на открытие кафе Питер') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299265,'Доп. Домашнее варенье из клюквы (260 гр)') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299287,'КАФЕ Хэнд-ролл Филадельфия в нори') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299288,'КАФЕ Запеченная индейка с чиа-кускусом') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299289,'КАФЕ Орзо с томленой говядиной') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299309,'КАФЕ Проработка') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299324,'КАФЕ Печенье-суфле протеиновое "Кокос", 50 гр х 9 шт') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299325,'КАФЕ Батончик протеиновый "Кокос", 50 г х 16 шт') ON CONFLICT DO NOTHING;
INSERT INTO ready_food_products(id,name) VALUES(1299394,'КАФЕ Блинчики с творожной начинкой (2 шт)') ON CONFLICT DO NOTHING;

-- 405 связей заготовка→блюдо с описаниями
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(81,'Пшеничная мука не для теста / Фасовка',1298406,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(82,'Лимонный сок с цедрой',1298405,'Помыть, натереть цедру на мелкой терке, не задевая белую часть, затем разрезать пополам и выжать сок. смешать цедру и сок.
Перед использованием в другие заготовки/фасовку хорошо размешивать!') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(82,'Лимонный сок с цедрой',1299288,'Помыть, натереть цедру на мелкой терке, не задевая белую часть, затем разрезать пополам и выжать сок. смешать цедру и сок.
Перед использованием в другие заготовки/фасовку хорошо размешивать!') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(140,'Руккола (не мыть)',1298836,'Рукколу свежую перебрать от непригодных к употреблению частей. Не мыть, не резать, распорционирвоать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(165,'Морковь мытая / Мелкая соломка',1298832,'Морковь натереть короткой соломкой толщиной 2-3 мм через робокоп со сменным ножом J 3/32"X3/32" и распорционировать в вакуумные пакеты.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(187,'Сок лимона (заправка) / Фасовка',1295229,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(213,'Красный лук (полукольца 0,2 см)',1298965,'Лук красный очищенный разрезать пополам 
по длине и нарезать полукольцами (толщина 2мм). 

Подготовленный лук красный распорционировать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(226,'Помидоры черри / Помыть',1293550,'Помидоры "Черри" перебрать, вымыть, обсушить.
На порцию 40 гр: больших 3 шт, маленьких 4 шт.
На порцию 60 гр: либо 4 крупных либо 5 мелких') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(226,'Помидоры черри / Помыть',1293573,'Помидоры "Черри" перебрать, вымыть, обсушить.
На порцию 40 гр: больших 3 шт, маленьких 4 шт.
На порцию 60 гр: либо 4 крупных либо 5 мелких') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(226,'Помидоры черри / Помыть',1294929,'Помидоры "Черри" перебрать, вымыть, обсушить.
На порцию 40 гр: больших 3 шт, маленьких 4 шт.
На порцию 60 гр: либо 4 крупных либо 5 мелких') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(226,'Помидоры черри / Помыть',1298832,'Помидоры "Черри" перебрать, вымыть, обсушить.
На порцию 40 гр: больших 3 шт, маленьких 4 шт.
На порцию 60 гр: либо 4 крупных либо 5 мелких') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(226,'Помидоры черри / Помыть',1298837,'Помидоры "Черри" перебрать, вымыть, обсушить.
На порцию 40 гр: больших 3 шт, маленьких 4 шт.
На порцию 60 гр: либо 4 крупных либо 5 мелких') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(226,'Помидоры черри / Помыть',1299247,'Помидоры "Черри" перебрать, вымыть, обсушить.
На порцию 40 гр: больших 3 шт, маленьких 4 шт.
На порцию 60 гр: либо 4 крупных либо 5 мелких') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(226,'Помидоры черри / Помыть',1299250,'Помидоры "Черри" перебрать, вымыть, обсушить.
На порцию 40 гр: больших 3 шт, маленьких 4 шт.
На порцию 60 гр: либо 4 крупных либо 5 мелких') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(241,'Свежий укроп (не мыть)',1295229,'Укроп свежий перебрать от непригодных к употреблению частей, удалить стебли только на 50%, не мыть, не резать, распорционировать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(241,'Свежий укроп (не мыть)',1298836,'Укроп свежий перебрать от непригодных к употреблению частей, удалить стебли только на 50%, не мыть, не резать, распорционировать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(252,'Петрушка свежая / Измельчить',1298406,'Подготвленную обработанную петрушку вымыть, тщательно обсушить, нашинковать ножом.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(252,'Петрушка свежая / Измельчить',1299289,'Подготвленную обработанную петрушку вымыть, тщательно обсушить, нашинковать ножом.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(255,'Салат романо / Помыть',1293573,'Тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(255,'Салат романо / Помыть',1294929,'Тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(255,'Салат романо / Помыть',1298865,'Тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(258,'Свежий тимьян (листья)',1297307,'тимьян помыть, ОСТАВИТЬ ЛИСТЬЯ БЕЗ ВЕТОЧЕК!!!') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(258,'Свежий тимьян (листья)',1299289,'тимьян помыть, ОСТАВИТЬ ЛИСТЬЯ БЕЗ ВЕТОЧЕК!!!') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(352,'Зеленый лук (не мыть)',1297441,'не мыть и не резать. Для приготовления использовать как белые, так и зеленые части лука. Подготовленный лук зеленый нарезать по длине пакета, расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(352,'Зеленый лук (не мыть)',1297442,'не мыть и не резать. Для приготовления использовать как белые, так и зеленые части лука. Подготовленный лук зеленый нарезать по длине пакета, расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(354,'Свекольный сок свежевыжатый',1297528,'Подготовленную очищенную свеклу разрезать на 4  
равные части и пропустить через соковыжималку, 
получив свекольный сок свежевыжатый.  

') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(402,'Мисо паста светлая / Фасовка',1297441,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(417,'Кремчиз (сливочный сыр творожный) / Фасовка',1298865,'фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(417,'Кремчиз (сливочный сыр творожный) / Фасовка',1298866,'фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(444,'Редис (не мыть)',1298836,'Редис свежий перебрать и удалить непригодные к употреблению части, НЕ МЫТЬ, обсушить, но не резать. Подготовленный редис распорционировать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(448,'Орегано / Фасовка',1298837,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(620,'Вяленые томаты / Половинки',1298865,'Томаты вяленые разрезать пополам по длине.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(623,'Вяленые томаты / Мясорубка',1295193,'Томаты вяленые пропустить через мясорубку') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(623,'Вяленые томаты / Мясорубка',1298407,'Томаты вяленые пропустить через мясорубку') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(623,'Вяленые томаты / Мясорубка',1298418,'Томаты вяленые пропустить через мясорубку') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(625,'Шпинат свежий / Помыть',1297548,'Подготовленный шпинат тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(625,'Шпинат свежий / Помыть',1298865,'Подготовленный шпинат тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(693,'Диетический малиновый соус (без желатина)',1293548,'Малину с/м дефростировать при комнатной температуре, добавить сахар, лимонную заправку, и все измельчить блендером до однородной консистенции. 
Подготовленную массу протереть через сито.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(693,'Диетический малиновый соус (без желатина)',1299161,'Малину с/м дефростировать при комнатной температуре, добавить сахар, лимонную заправку, и все измельчить блендером до однородной консистенции. 
Подготовленную массу протереть через сито.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(819,'Соус мирин / Фасовка',1297441,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(894,'Семечки тыквы очищенное / Фасовка (не жарить)',1298836,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1027,'Соленые огурцы / Кубик / 1,0х1,0см',1297537,'Подготовленные соленые огурцы нарезать кубиком 1,0х1,0см,
откинуть на сито, дать стечь лишней жидкости, распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1082,'Брусничный соус к мясу',1297306,'Бруснику с/м выложить в кастрюлю, добавить сахар, апельсиновый сок ( из расчета на 1,0 готового соуса нужно взять 410г), веточки розмарина свежего, крем бальзамик. Перемешать, довести до кипения, варить в течение 10 минут. Затем, удалить розмарин, и ввести тонкой струйкой, при постоянном помешивании, крахмал, предварительно разведенный соком апельсиновым (45г). Перемешать, довести до кипения, снять с плиты, остудить, распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1176,'Лимонный мусс',1298409,'В сотейник с лимонным соусом на медленном огне аккуратно добавляют желатин (набухший без воды), тщательно размешивают в соусе, чтобы желатин полностью растворился. 
Смесь доводят до кипения, НО НЕ КИПЯТЯТ!

В большую миску выкладывают творог, добавляют лимонный крем и пробивают с помощью погружного блендера до однородной конситенции.
затем добавляют половину взбитого белка и снова пробиваем бледреом, 
Последним этапом.
В получившуюся массу аккуратно спатулой вмешиваем вторую половину взбитого белка
Перекладывают готовый крем в кондитерский мешок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1277,'Зеленый чатни с мятой, петрушкой и базиликом',1297442,'помыть зелень, удалить жеские ножки, перемолоть все в блендере') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1289,'Сметана 15% / Фасовка',1299162,'фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1377,'Гаспачо',1298751,'Огурцы нарезают произвольными кусками среднего размера.
Уксус смешивают с солью, сахаром и перцем до растворения сахара и соли.
Перец гриль запекают на противне с пергаментом в конвектомате при температуре 160 С около
5-7 минут до готовности, затем перцы обязательно остужают до комнатной температуры.
Все ингредиенты соединяют, перемешивают и измельчают блендером до однородной консистенции супа-пюре, порционируют. ') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1612,'Жареные шампиньоны',1293619,'Грибы моют, просушивают, нарезают слайсами толщиной 0,2-0,3 см. обжаривают на подсолнечном масле до готовности, при этом , чтобы форма слайсов была сохранена.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1612,'Жареные шампиньоны',1297320,'Грибы моют, просушивают, нарезают слайсами толщиной 0,2-0,3 см. обжаривают на подсолнечном масле до готовности, при этом , чтобы форма слайсов была сохранена.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1612,'Жареные шампиньоны',1297549,'Грибы моют, просушивают, нарезают слайсами толщиной 0,2-0,3 см. обжаривают на подсолнечном масле до готовности, при этом , чтобы форма слайсов была сохранена.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1612,'Жареные шампиньоны',1299309,'Грибы моют, просушивают, нарезают слайсами толщиной 0,2-0,3 см. обжаривают на подсолнечном масле до готовности, при этом , чтобы форма слайсов была сохранена.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1649,'Лук с имбирем',1293625,'Лук репчатый нарезают кубиком 1х1 см на робокопе. Для равномерной нарезки необходимо прочищать насадки робокопа каждые 3-4 кг измельченного лука. Корень имбиря измельчают в крошку.Ингредиенты тщательно перемешивают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1956,'Ягодный компот (соус)',1005000,'В глубокой сковороде растопить сахар, добавить бальзамик, ягоды, корицу. ванилин Уменьшить огонь и томить, аккуратно помешивая, пока ягоды не пустят сок и не создаться сироп. ЯГОДЫ НЕ НАДО ПЕРЕВАРИВАТЬ. Они должны сохранить немного хрустящей структуры') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1956,'Ягодный компот (соус)',1295466,'В глубокой сковороде растопить сахар, добавить бальзамик, ягоды, корицу. ванилин Уменьшить огонь и томить, аккуратно помешивая, пока ягоды не пустят сок и не создаться сироп. ЯГОДЫ НЕ НАДО ПЕРЕВАРИВАТЬ. Они должны сохранить немного хрустящей структуры') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1956,'Ягодный компот (соус)',1297318,'В глубокой сковороде растопить сахар, добавить бальзамик, ягоды, корицу. ванилин Уменьшить огонь и томить, аккуратно помешивая, пока ягоды не пустят сок и не создаться сироп. ЯГОДЫ НЕ НАДО ПЕРЕВАРИВАТЬ. Они должны сохранить немного хрустящей структуры') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1977,'Соус винегрет',1297537,'Все компоненты соединить  и тщательно 
перемешать до  однородной консистенции.    

Готовый соус распорционировать в вакуумные пакеты.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1977,'Соус винегрет',1299247,'Все компоненты соединить  и тщательно 
перемешать до  однородной консистенции.    

Готовый соус распорционировать в вакуумные пакеты.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(1998,'Сливки 22% / Фасовка',1299211,'Упаковку вскрыть, содержимое перетарить и распорционировать в вакуумные пакеты') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(2870,'Сок лимона с орегано',1295194,'Ингредиенты соединяют и тщательно перемешивают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(2934,'Рис тайский вареный',1293619,'Рис "Жасмин" после вскрытия упаковки перебрать от не пригодных к употреблению частей,  
на плите, заливаем кипятком, добавляем соль, масло 
готовим на слабом огне под крышкой 14 минут 

в духовке: 
выложить в нержавеющий лоток с небольшими бортами, налить воду, добавить  соль, все перемешать.   Подготовленный рис (в лотке) варить в пароконвектомате при t - 100град.С в течение 35 мин  до готовности.  Готовый рис остудить, распорционировать в вакуумные пакеты.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(2934,'Рис тайский вареный',1295201,'Рис "Жасмин" после вскрытия упаковки перебрать от не пригодных к употреблению частей,  
на плите, заливаем кипятком, добавляем соль, масло 
готовим на слабом огне под крышкой 14 минут 

в духовке: 
выложить в нержавеющий лоток с небольшими бортами, налить воду, добавить  соль, все перемешать.   Подготовленный рис (в лотке) варить в пароконвектомате при t - 100град.С в течение 35 мин  до готовности.  Готовый рис остудить, распорционировать в вакуумные пакеты.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(2934,'Рис тайский вареный',1297320,'Рис "Жасмин" после вскрытия упаковки перебрать от не пригодных к употреблению частей,  
на плите, заливаем кипятком, добавляем соль, масло 
готовим на слабом огне под крышкой 14 минут 

в духовке: 
выложить в нержавеющий лоток с небольшими бортами, налить воду, добавить  соль, все перемешать.   Подготовленный рис (в лотке) варить в пароконвектомате при t - 100град.С в течение 35 мин  до готовности.  Готовый рис остудить, распорционировать в вакуумные пакеты.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(2934,'Рис тайский вареный',1297442,'Рис "Жасмин" после вскрытия упаковки перебрать от не пригодных к употреблению частей,  
на плите, заливаем кипятком, добавляем соль, масло 
готовим на слабом огне под крышкой 14 минут 

в духовке: 
выложить в нержавеющий лоток с небольшими бортами, налить воду, добавить  соль, все перемешать.   Подготовленный рис (в лотке) варить в пароконвектомате при t - 100град.С в течение 35 мин  до готовности.  Готовый рис остудить, распорционировать в вакуумные пакеты.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(2977,'Сухарики из чиабатты (кубик 1,0х1,0см)',1293573,'Чиабатту нарезать кубиками 1,0х10см, полить оливковым маслом, все аккуратно перемешать,  выложить на противень (или лист) с пергаментом,  
запекать в пароконвектомате при t - 150град.С  в течение 7 минут, затем перемешать гренки для однородной прожарки и 
запекать при этой же температуре еще 8 минут до равномерного коллера. Остудить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(2977,'Сухарики из чиабатты (кубик 1,0х1,0см)',1294929,'Чиабатту нарезать кубиками 1,0х10см, полить оливковым маслом, все аккуратно перемешать,  выложить на противень (или лист) с пергаментом,  
запекать в пароконвектомате при t - 150град.С  в течение 7 минут, затем перемешать гренки для однородной прожарки и 
запекать при этой же температуре еще 8 минут до равномерного коллера. Остудить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3101,'Икра летучей рыбы ОРАНЖЕВАЯ / Фасовка',1299208,'ВАЖНО! 
При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). 
Упаковку вскрыть, содержимое расфасовать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3103,'Домашний майонез с шрирача',1297548,'Подготовить ручной миксер Robot Coupe/венчик, кастрюлю подходящего объема. 

В кастрюлю добавить желтки, взбить с помощью миксера/венчика в течение 3..5 минут до однородной консистенции и густой пены. 
Затем тонкой струйкой к желткам влить подсолнечное масло, одновременно взбивая смесь миксером в течение 3..5 минут до однородной плотной консистенции. 
Далее в получившуюся яично-масляную смесь добавить остальные ингредиенты (горчицу дижонскую, уксус винный, шрирача, соль, перец молотый) и тщательно перемешать 
с помощью миксера в течение 3 минут до однородной консистенции. Соус готов.

Готовый соус накрыть крышкой или пленкой и проставить маркировку (наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Хранить в холодильной камере.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3415,'Картофель Су-вид / кубик 1х1 см',1297314,'картофель НАРЕЗАТЬ КУБИК 1 НА РОБОКОПЕ, промыть в большом количестве холодной проточной воды, откинуть на перфорированный лоток и дать стечь влаге, фасуем по вакуумам, режим 9, конвектомат на 80 градусов НА ПАР, на 2 часа 10 мин, затем РЕЗКО охладить в ванне с холодной водой и убрать в плюсовую камеру') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3415,'Картофель Су-вид / кубик 1х1 см',1297528,'картофель НАРЕЗАТЬ КУБИК 1 НА РОБОКОПЕ, промыть в большом количестве холодной проточной воды, откинуть на перфорированный лоток и дать стечь влаге, фасуем по вакуумам, режим 9, конвектомат на 80 градусов НА ПАР, на 2 часа 10 мин, затем РЕЗКО охладить в ванне с холодной водой и убрать в плюсовую камеру') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3415,'Картофель Су-вид / кубик 1х1 см',1297537,'картофель НАРЕЗАТЬ КУБИК 1 НА РОБОКОПЕ, промыть в большом количестве холодной проточной воды, откинуть на перфорированный лоток и дать стечь влаге, фасуем по вакуумам, режим 9, конвектомат на 80 градусов НА ПАР, на 2 часа 10 мин, затем РЕЗКО охладить в ванне с холодной водой и убрать в плюсовую камеру') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3415,'Картофель Су-вид / кубик 1х1 см',1298835,'картофель НАРЕЗАТЬ КУБИК 1 НА РОБОКОПЕ, промыть в большом количестве холодной проточной воды, откинуть на перфорированный лоток и дать стечь влаге, фасуем по вакуумам, режим 9, конвектомат на 80 градусов НА ПАР, на 2 часа 10 мин, затем РЕЗКО охладить в ванне с холодной водой и убрать в плюсовую камеру') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3711,'Вареный птитим',1297547,'Макаронные изделия (Птитим) выложить в нержавеющий лоток  
с небольшими бортами, добавить воду, соль, все перемешать.  

Подготовленный птитим (в лотке) варить в пароконвектомате 
в режиме "ПАР" при t - 100град.С в течение 30-40 мин до готовности.  

Готовый птитим заправить растительным маслом, перемешать,  
остудить, распорционировать в вакуумные пакеты, завакуумировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3711,'Вареный птитим',1298407,'Макаронные изделия (Птитим) выложить в нержавеющий лоток  
с небольшими бортами, добавить воду, соль, все перемешать.  

Подготовленный птитим (в лотке) варить в пароконвектомате 
в режиме "ПАР" при t - 100град.С в течение 30-40 мин до готовности.  

Готовый птитим заправить растительным маслом, перемешать,  
остудить, распорционировать в вакуумные пакеты, завакуумировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3796,'Вареная киноа',1293473,'Киноа перебирают от непригодных к употреблению частей, отваривают в кипящей подсоленой воде до готовности. Далее с помощью сита отделяют крупу от лишней жидкости,
промывают холодной кипяченой водой, повторно удаляют лишнюю жидкость с помощью сита.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3796,'Вареная киноа',1294927,'Киноа перебирают от непригодных к употреблению частей, отваривают в кипящей подсоленой воде до готовности. Далее с помощью сита отделяют крупу от лишней жидкости,
промывают холодной кипяченой водой, повторно удаляют лишнюю жидкость с помощью сита.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3796,'Вареная киноа',1294931,'Киноа перебирают от непригодных к употреблению частей, отваривают в кипящей подсоленой воде до готовности. Далее с помощью сита отделяют крупу от лишней жидкости,
промывают холодной кипяченой водой, повторно удаляют лишнюю жидкость с помощью сита.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3796,'Вареная киноа',1297307,'Киноа перебирают от непригодных к употреблению частей, отваривают в кипящей подсоленой воде до готовности. Далее с помощью сита отделяют крупу от лишней жидкости,
промывают холодной кипяченой водой, повторно удаляют лишнюю жидкость с помощью сита.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3796,'Вареная киноа',1298832,'Киноа перебирают от непригодных к употреблению частей, отваривают в кипящей подсоленой воде до готовности. Далее с помощью сита отделяют крупу от лишней жидкости,
промывают холодной кипяченой водой, повторно удаляют лишнюю жидкость с помощью сита.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3875,'Микс кунжута 1:1',1297305,'фасовка в соотношении 1:1') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3875,'Микс кунжута 1:1',1299208,'фасовка в соотношении 1:1') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(3940,'Маринованная морковь',1297538,'ВАЖНО СОБЛЮДАТЬ ПРОПОРЦИИ МОРКОВИИ И МАРИНАДА! 1,5:1!
Соединить маринад с морковью, тщательно перемешать, расфасовать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4053,'Домашний соус песто с кешью для капрезе',1298836,'Слегка поджарить орехи, но НЕ СЖЕЧЬ! 
Остудить в течение 2-3 мин. 
Базилик тщательно промыть и просушить.

Все компоненты соединить, добавить 
базилик свежий (со стеблями) и 1/2 масла подсолнечного и смешать
блендером до равномерно измельченных ингредиентов.
Затем в последнюю очередь добавить еще 1/2 часть подсолнечного масла, перемешать.

ФАСОВКА НА ПОРЦИЮ 200 гр в Стеклянную банку 250 мл с крышкой : предварительно банки и крышки простерилизовать в пароконвектомате - режим пар 20 мин, 
затем в них расфасовать соус, плотно закрутить крышку.
На банку наклеить брендированную наклейку, на дно банки - датером дату изготовления.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4053,'Домашний соус песто с кешью для капрезе',1298865,'Слегка поджарить орехи, но НЕ СЖЕЧЬ! 
Остудить в течение 2-3 мин. 
Базилик тщательно промыть и просушить.

Все компоненты соединить, добавить 
базилик свежий (со стеблями) и 1/2 масла подсолнечного и смешать
блендером до равномерно измельченных ингредиентов.
Затем в последнюю очередь добавить еще 1/2 часть подсолнечного масла, перемешать.

ФАСОВКА НА ПОРЦИЮ 200 гр в Стеклянную банку 250 мл с крышкой : предварительно банки и крышки простерилизовать в пароконвектомате - режим пар 20 мин, 
затем в них расфасовать соус, плотно закрутить крышку.
На банку наклеить брендированную наклейку, на дно банки - датером дату изготовления.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4106,'Специи: кориандр + карри',1298770,'смешать и расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4190,'Вареная гречка',1293621,'Крупу гречневую перебрать, тщательно промыть 2-3 раза.  
Крупу в сотейнике залить кипятком в пропорции 2:1 к крупе.
Варить на плите на среднем огне до кипения, затем убавить мощность до минимальной, добавить соль и тщательно перемешать до растворения соли.
Далее варить на слабом огне на плите под крышкой 15-18 минут до готовности крупы.

Крупу гречневую перебрать, тщательно промыть 2-3 раза. Крупу в сотейнике залить холодной водой в пропорции 2:1 к крупе. 
Варить на плите на среднем огне до кипения, затем убавить мощность до минимальной, добавить соль и тщательно перемешать до растворения соли. 
Далее варить на слабом огне на плите под крышкой 15-18 минут до готовности крупы. 
Готовую вареную гречку откинуть на сито, дать хорошо стечь остаткам воды. НЕ промывать!
После чего переместить в гастроемкость, заправить маслом, перемешать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4190,'Вареная гречка',1294926,'Крупу гречневую перебрать, тщательно промыть 2-3 раза.  
Крупу в сотейнике залить кипятком в пропорции 2:1 к крупе.
Варить на плите на среднем огне до кипения, затем убавить мощность до минимальной, добавить соль и тщательно перемешать до растворения соли.
Далее варить на слабом огне на плите под крышкой 15-18 минут до готовности крупы.

Крупу гречневую перебрать, тщательно промыть 2-3 раза. Крупу в сотейнике залить холодной водой в пропорции 2:1 к крупе. 
Варить на плите на среднем огне до кипения, затем убавить мощность до минимальной, добавить соль и тщательно перемешать до растворения соли. 
Далее варить на слабом огне на плите под крышкой 15-18 минут до готовности крупы. 
Готовую вареную гречку откинуть на сито, дать хорошо стечь остаткам воды. НЕ промывать!
После чего переместить в гастроемкость, заправить маслом, перемешать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4190,'Вареная гречка',1297306,'Крупу гречневую перебрать, тщательно промыть 2-3 раза.  
Крупу в сотейнике залить кипятком в пропорции 2:1 к крупе.
Варить на плите на среднем огне до кипения, затем убавить мощность до минимальной, добавить соль и тщательно перемешать до растворения соли.
Далее варить на слабом огне на плите под крышкой 15-18 минут до готовности крупы.

Крупу гречневую перебрать, тщательно промыть 2-3 раза. Крупу в сотейнике залить холодной водой в пропорции 2:1 к крупе. 
Варить на плите на среднем огне до кипения, затем убавить мощность до минимальной, добавить соль и тщательно перемешать до растворения соли. 
Далее варить на слабом огне на плите под крышкой 15-18 минут до готовности крупы. 
Готовую вареную гречку откинуть на сито, дать хорошо стечь остаткам воды. НЕ промывать!
После чего переместить в гастроемкость, заправить маслом, перемешать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4245,'Запеченная морковь / Бруски',1297308,'Морковь смешивают с медом, маслом и специями, выкладывают на противень с пергаментом, запекают в пароконвектомате при температуре 180 С - 30 минут. Полуфабрикат остужают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4245,'Запеченная морковь / Бруски',1298177,'Морковь смешивают с медом, маслом и специями, выкладывают на противень с пергаментом, запекают в пароконвектомате при температуре 180 С - 30 минут. Полуфабрикат остужают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4279,'Соевые бобы эдамаме / Фасовка',1297441,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4279,'Соевые бобы эдамаме / Фасовка',1298836,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4376,'Розмарин свежий (листья)',1297306,'Розмарин свежий перебрать от непригодных к употреблению частей, удалить стебли, оставив только листья.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4411,'Каперсы консервированные / Перетаривание',1298408,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). Упаковку вскрыть, содержимое перетарить в гастроемкость. 

Упаковку вскрыть, содержимое откинуть 
на сито, дать стечь лишней жидкости.

Содержимое перетарить в другую глубокую 
емкость. ') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4444,'Масло оливковое / Перетаривание',1298837,'упаковку вскрыть, содержимое  перетарить в глубокую емкость.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4449,'Свежая мята обработанная (листья)',1297307,'Мяту свежую перебрать от непригодных  к употреблению частей, удалить стебли, оставив только листья, тщательно промыть и обсушить') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4462,'Маслины каламата / Перетаривание',1298837,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). Упаковку вскрыть, содержимое откинуть на сито, дать стечь маринаду.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4508,'ДЕГУСТАЦИЯ готовые шоколадные кукис',1295273,'Включаем духовку на 180°С Сливочное масло с патокой и сахаром комнатной температуры кладем в миску 2 яйца моем и разбиваем в масляную смесь. Взбиваем миксером Всыпаем сухие компоненты, кроме шоколада. Взбиваем Добавляем шоколад и перемешиваем лопаткой Противни застилаем пергаментом По 40 г выкладываем тесто на противни на расстоянии 3 см друг от друга Отправляем противни в духовку на 8 минут После перекладываем пергамент с печеньями на стол и оставляем остывать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4512,'Вареная гречневая лапша',1297305,'Сварить лапшу в течение 3-4 минут в кипятке, слить воду, промыть холодной КИПЯЧЕНОЙ водой, дать стечь лишней жидкости, 
заправить маслом, дать стечь лишней жидкости, распорционировать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4530,'Базилик свежий зеленый (листья)',1298752,'У подготовленного базилика свежего удалить стебли, оставив только листья.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4571,'Цыпленок тандури томленый',1297442,'Соль растворяют в холодной воде. Куриное филе маринуют в подсоленой воде в холодильной камере 2 часа, затем воду сливают, куриное филе просушивают бумажными полотенцами. 
Далее куриное филе натирают пряной смесью тандури и подсолнечным маслом, оставляют при комнатной температуре на 30 минут либо убирают в холодильную камеру на 2-3 часа
( за 30 минут до запекания куриное филе вынимают из холодильной камеры). Конвектомат прогревают до 220 С, на противень с бумагой для выпечки выкладывают подготовленное 
куриное филе, запекают при температуре 180 С около 14-15 минут, затем выключают конвектомат, куриное филе оставляют томиться 2 часа ( дверцу конвектомата не открывать ). 
Готовый полуфабрикат заворачивают в фольгу, остужают в холодильной камере 1,5-2 часа, нарезают слайсами толщиной 0,3-0,4 см, вакуумируют.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(4727,'Бланшированная фасоль зеленая стручковая с/м',1297305,'Фасоль зеленую стручковую бланшировать в кипящей воде в течение 30-40сек.
Далее, фасоль откинуть на сито, промыть холодной КИПЯЧЕННОЙ водой, дать 
хорошо стечь лишней жидкости. 

Готовую бланшированную фасоль распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5045,'Картофель бэби вареный половинки',1298406,'Картофель перебрать (калибровка), промыть, сварить до готовности, но НЕ ПЕРЕВАРИТЬ!!! Воду слить, картофель остудить.  Готовый вареный охлажденный картофель , разрезать пополам, распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5074,'Редис мытый / Кубик 1х1 см',1298835,'У подготовленного редиса отрезать непригодные к употреблению части, нарезать кубиком 1х1 см') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5350,'Чесночный соус с тимьяном',1297306,'Чеснок положить в кастрюлю, залить водой и томить в воде с петрушкой (стебли) и тимьяном (ветки с листьями) 30 минут на слабом огне. 
Следим чтобы вода выпаривалась, чеснок тушился, но не подгорал. По истечению 30 мин вода должна почти выпариться, а чеснок стать мягким. 
Затем вытащить травы,  и пробить блендером.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5362,'Салат романо / Фасовка',1298836,'Распорционировать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5400,'П/Ф: Горошек жареный',1298406,'На разогретой сковороде с добавлением 
лаймового масла обжарить горошек с/м 
(НЕ РАЗМОРАЖИВАЯ!!!) в течение 5-7 мин ,
до полного растопления лаймового масла. Остудить.


Готовый припущенный зеленый горошек распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5434,'Укроп без стебля / Измельчить',1297537,'Подготовленный укроп перебрать, промыть, удалить стебли, нашинковать только зеленую часть.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5434,'Укроп без стебля / Измельчить',1298178,'Подготовленный укроп перебрать, промыть, удалить стебли, нашинковать только зеленую часть.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5434,'Укроп без стебля / Измельчить',1298406,'Подготовленный укроп перебрать, промыть, удалить стебли, нашинковать только зеленую часть.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5434,'Укроп без стебля / Измельчить',1298835,'Подготовленный укроп перебрать, промыть, удалить стебли, нашинковать только зеленую часть.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5644,'Запеченная свекла / Бруски',1297308,'Свеклу смешивают со специями и маслом, выкладывают на противень с пергаментом,
запекают в пароконвектомате при температуре 180 С - 50 минут. Полуфабрикат остужают.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5644,'Запеченная свекла / Бруски',1298177,'Свеклу смешивают со специями и маслом, выкладывают на противень с пергаментом,
запекают в пароконвектомате при температуре 180 С - 50 минут. Полуфабрикат остужают.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5879,'Домашний майонез "Провансаль Эрмитаж"',1297314,'Смешивают желтки, горчицу, масло  вливают тонкой струйкой, одновременно взбивая смесь блендером до однородной плотной консистенции, затем добавляют винный уксус, тщательно 
перемешивают, порционируют.
ФАСОВКА НА ПОРЦИЮ 180 гр в Стеклянную банку 250 мл с крышкой : предварительно банки и крышки простерилизовать в пароконвектомате - режим пар 20 мин, 
затем в них расфасовать соус, плотно закрутить крышку.
На банку наклеить брендированную наклейку, на дно банки - датером дату изготовления.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5879,'Домашний майонез "Провансаль Эрмитаж"',1298866,'Смешивают желтки, горчицу, масло  вливают тонкой струйкой, одновременно взбивая смесь блендером до однородной плотной консистенции, затем добавляют винный уксус, тщательно 
перемешивают, порционируют.
ФАСОВКА НА ПОРЦИЮ 180 гр в Стеклянную банку 250 мл с крышкой : предварительно банки и крышки простерилизовать в пароконвектомате - режим пар 20 мин, 
затем в них расфасовать соус, плотно закрутить крышку.
На банку наклеить брендированную наклейку, на дно банки - датером дату изготовления.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5893,'Семена чиа / Фасовка',1298405,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5893,'Семена чиа / Фасовка',1299288,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(5938,'Баклажан запеченный (ломтики)',1298770,'Обработанные баклажаны нарезают вдоль волокон ломтиками на мандолине (длина 8 см, толщина 1 см),  если баклажан большой- нужно разрезать поперек на 2-3 части.
Затем посыпают солью, поливают маслом и перемешивают. 
Затем выкладывают одним слоем в гастроемкость, запекают в конвектомате 9 минут при температуре 250 С до готовности.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(6036,'Запеченная тыква от Ульяны Тихмяновой',1297308,'Зубчики чеснока слегка продавливают. Очищенную тыкву нарезают ломтиками  со сторонами 1,5-2 см, добавляют оливковое масло и соль, тщательно перемешивают. 
На противень с фольгой равномерным слоем выкладывают тыкву, верхним слоем распределяют зубчики чеснока и листья шалфея, полуфабрикат плотно закрывают фольгой.
Тыкву запекают в конвектомате 50 минут при температуре 200 С. Затем остужают и порционируют без листьев шалфея.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(6081,'Сыр фета / Кубик 1х1 см',1293550,'Подготовленный сыр нарезать кубиком 1,0х1,0см') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(6285,'Огурцы короткоплодные 70-140 гр/шт',1298836,NULL) ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(6667,'Белокочанная капуста / Соломка',1297528,'Капусту зачищенную нарезать на робокопе, используя сменный нож E/S 1 3/64 тонкой соломкой (длина 5-6см, толщина 0,3см).') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(6667,'Белокочанная капуста / Соломка',1298965,'Капусту зачищенную нарезать на робокопе, используя сменный нож E/S 1 3/64 тонкой соломкой (длина 5-6см, толщина 0,3см).') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7261,'Апельсиновый соус для тунца',1294931,'Все ингредиенты соединяют и смешивают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7397,'Перечный соус демиглас на основе бешамеля',1297549,'Подготовить кастрюлю подходящего объема, ручной блендер Robot Coupe, лопатку для перемешивания.

Плиту разогреть. На плиту поставить кастрюлю подходящего размера, добавить сливочное масло и репчатый лук с сахаром, обжарить до полуготовности
на сильном огне, затем переключить на слабый огонь и добавить предварительно подготовленный соус бешамель, сливки 22%, демиглас, дробленый перец, соль,
все ингредиенты тщательно перемешать лопаткой.
Соус довести до кипения и уваривать до консистенции сметаны 5-10 минут, снять с плиты, повторно перемешать полуфабрикат ручным блендером.

Важно! Консистенция соуса должна быть однородной с равномерно распределенными маленькими частицами лука и перца. Вкус солоноватый, сбалансированный. 
Текстура без осадка и пены.

Готовый соус накрыть крышкой или пленкой и проставить маркировку (наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Хранить в холодильной камере.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7409,'Зеленый лук (помыть)',1295193,'Подготовленный зеленый лук тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7409,'Зеленый лук (помыть)',1295201,'Подготовленный зеленый лук тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7409,'Зеленый лук (помыть)',1297305,'Подготовленный зеленый лук тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7409,'Зеленый лук (помыть)',1298866,'Подготовленный зеленый лук тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7437,'Специи: молотый имбирь + чеснок',1295201,'смешать и расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7437,'Специи: молотый имбирь + чеснок',1297441,'смешать и расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7548,'Соевые бобы эдамаме маринованные',1293473,'В опрокидывающуюся сковороду наливают питьевую воду и доводят до кипения.
Как только вода закипит, вскрывают пакеты с замороженными бобами эдамамэ, пересыпают их в сковороду по весу и бланшируют их в кипящей воде в течение 30..40 секунд. 
Соль  и масло подсолнечное  смешивают в отдельной емкости.
Бобы промывают, перемешивают с подготовленным маслом и солью, порционируют также с маслом.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7548,'Соевые бобы эдамаме маринованные',1293550,'В опрокидывающуюся сковороду наливают питьевую воду и доводят до кипения.
Как только вода закипит, вскрывают пакеты с замороженными бобами эдамамэ, пересыпают их в сковороду по весу и бланшируют их в кипящей воде в течение 30..40 секунд. 
Соль  и масло подсолнечное  смешивают в отдельной емкости.
Бобы промывают, перемешивают с подготовленным маслом и солью, порционируют также с маслом.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7548,'Соевые бобы эдамаме маринованные',1294927,'В опрокидывающуюся сковороду наливают питьевую воду и доводят до кипения.
Как только вода закипит, вскрывают пакеты с замороженными бобами эдамамэ, пересыпают их в сковороду по весу и бланшируют их в кипящей воде в течение 30..40 секунд. 
Соль  и масло подсолнечное  смешивают в отдельной емкости.
Бобы промывают, перемешивают с подготовленным маслом и солью, порционируют также с маслом.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7548,'Соевые бобы эдамаме маринованные',1294931,'В опрокидывающуюся сковороду наливают питьевую воду и доводят до кипения.
Как только вода закипит, вскрывают пакеты с замороженными бобами эдамамэ, пересыпают их в сковороду по весу и бланшируют их в кипящей воде в течение 30..40 секунд. 
Соль  и масло подсолнечное  смешивают в отдельной емкости.
Бобы промывают, перемешивают с подготовленным маслом и солью, порционируют также с маслом.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7548,'Соевые бобы эдамаме маринованные',1298832,'В опрокидывающуюся сковороду наливают питьевую воду и доводят до кипения.
Как только вода закипит, вскрывают пакеты с замороженными бобами эдамамэ, пересыпают их в сковороду по весу и бланшируют их в кипящей воде в течение 30..40 секунд. 
Соль  и масло подсолнечное  смешивают в отдельной емкости.
Бобы промывают, перемешивают с подготовленным маслом и солью, порционируют также с маслом.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7548,'Соевые бобы эдамаме маринованные',1299208,'В опрокидывающуюся сковороду наливают питьевую воду и доводят до кипения.
Как только вода закипит, вскрывают пакеты с замороженными бобами эдамамэ, пересыпают их в сковороду по весу и бланшируют их в кипящей воде в течение 30..40 секунд. 
Соль  и масло подсолнечное  смешивают в отдельной емкости.
Бобы промывают, перемешивают с подготовленным маслом и солью, порционируют также с маслом.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7665,'Фурикакэ / Фасовка',1295201,'Фасовка. Нужное количество ингредиента отмерить на высокоточных весах с диапазоном измерения 0,1 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7677,'Маринованные корнишоны / Квадратики',1297314,'корнишоны нарезают на робокопе (с лезвием S-3 mmи насадкой на кубик 0,8 см) на мелкие квадраты') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7677,'Маринованные корнишоны / Квадратики',1298866,'корнишоны нарезают на робокопе (с лезвием S-3 mmи насадкой на кубик 0,8 см) на мелкие квадраты') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7695,'Паста из трав с чесноком (петрушка+масло+чеснок)',1293621,'Петрушку шинкуют/измельчают с помощью куттера, тщательно смешивают с измельченным чесноком и подсолнечным маслом.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7707,'Тертый сыр пармезан (крошка) / Фасовка',1293551,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7707,'Тертый сыр пармезан (крошка) / Фасовка',1293573,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7707,'Тертый сыр пармезан (крошка) / Фасовка',1294929,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7707,'Тертый сыр пармезан (крошка) / Фасовка',1298408,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7765,'Клубничный соус',1293546,'Клубнику, сахар и лимонную заправку соединить. Все измельчить блендером до однородной консистенции. Подготовленную массу протереть через сито. 
Разогреть плиту, полученный соус прогреть и довести до кипения, постоянно помешивая лопаткой. После кипения соус снять с плиты, остудить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7765,'Клубничный соус',1297319,'Клубнику, сахар и лимонную заправку соединить. Все измельчить блендером до однородной консистенции. Подготовленную массу протереть через сито. 
Разогреть плиту, полученный соус прогреть и довести до кипения, постоянно помешивая лопаткой. После кипения соус снять с плиты, остудить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7866,'Азиатский соус микс: соевый соус + кунжутное масло + кукурузный сироп + рисовый уксус',1298832,'смешать до однородности') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7960,'Соус манго-майо',1298839,'Охлажденные желтки куриные взбить миксером до пышной густой пены, затем постепенно ввести тонкой струйкой масло подсолнечное, специи, винный белый уксус, соус шрирача, 
горчицу дижонскую, продолжая взбивать до густой консистенции. В последнюю очередь добавляют воду, специи манго и карри и пюре манго размороженное. ') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7968,'Микрозелень гороха / Фасовка',1293473,'перебрать от непригодных к употреблению частей, расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7968,'Микрозелень гороха / Фасовка',1294927,'перебрать от непригодных к употреблению частей, расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7968,'Микрозелень гороха / Фасовка',1294931,'перебрать от непригодных к употреблению частей, расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7968,'Микрозелень гороха / Фасовка',1298832,'перебрать от непригодных к употреблению частей, расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(7983,'Яичный желток "Удобное яйцо" / Фасовка',1298406,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8049,'Яичный скрамбл',1297314,'Яичный меланж выливаем на раскаленную сковороду, жарим 2-3 минуты, тщательно перемешивая.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8269,'Дайкон маринованный / Кубик 1х1 см',1298832,'Вскрыть производственную упаковку, выложить дайкон на сито, отделив от маринада. Цельный дайкон нарезать кубиком 1*1 см, расфасовать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8342,'Сушеный микс грибов: шиитаке, муэр (7/10) / Фасовка',1297441,'фасовка: 7 г шиитаке + 10 г муэр
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8442,'Томатный соус маринара',1298408,'Подготовить кастрюлю подходящего объема, лопатку для перемешивания. 

На плиту поставить кастрюлю подходящего размера, влить оливковое масло и разогреть, затем добавить нарезанные овощи (лук репчатый и чеснок),
периодически помешивая жарить до полуготовности 2-4 мин.
Затем ввести консервированные томаты, тщательно перемешать и довести до кипения, далее добавить сахарную пудру, специи и базилик, все перемешать, 
повторно довести до кипения, томить на слабом огне 15 мин , снять с плиты. Пробить блендером.

Важно! Вкус и послескусие должны быть сладковато-солеными, НЕ луковыми.

Готовый соус накрыть крышкой или пленкой и проставить маркировку (наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Хранить в холодильной камере.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8442,'Томатный соус маринара',1299163,'Подготовить кастрюлю подходящего объема, лопатку для перемешивания. 

На плиту поставить кастрюлю подходящего размера, влить оливковое масло и разогреть, затем добавить нарезанные овощи (лук репчатый и чеснок),
периодически помешивая жарить до полуготовности 2-4 мин.
Затем ввести консервированные томаты, тщательно перемешать и довести до кипения, далее добавить сахарную пудру, специи и базилик, все перемешать, 
повторно довести до кипения, томить на слабом огне 15 мин , снять с плиты. Пробить блендером.

Важно! Вкус и послескусие должны быть сладковато-солеными, НЕ луковыми.

Готовый соус накрыть крышкой или пленкой и проставить маркировку (наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Хранить в холодильной камере.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8446,'Соевый соус (Pearl River Bridge) / Фасовка',1299164,'Ингредиенты тщательно перемешать до однородной консистенции.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8464,'Соевый соус (Pearl River Bridge) / Разбавленный',1297306,'ВАЖНО! Использовать воду из кулера, НЕ ИЗ ПОД КРАНА!
Ингредиенты тщательно перемешать до однородной консистенции в соотношении соевого соуса к воде 1:2,5.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8535,'Кунжутный терияки соус: соевый соус, кунжутное масло, мед, терияки',1297305,'Все ингредиенты соединить и смешать до однородной консистенции.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8577,'Трюфельное масло / Перетаривание',1299289,'упаковку вскрыть, содержимое  перетарить в глубокую емкость.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8632,'Морковь очищенная Су-вид / Кубик 1х1 см',1297314,'Морковь очищенную обработать кипятком (бланшировать), НАРЕЗАТЬ КУБИК 1 НА РОБОКОПЕ, расфасовать по вакуумам, выложить по лоткам
в пароконвектомат на режим 9 на 80 градусов НА ПАР, на 40 мин, затем РЕЗКО охладить в ванне с холодной водой и убрать в холодильную камеру.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8632,'Морковь очищенная Су-вид / Кубик 1х1 см',1297537,'Морковь очищенную обработать кипятком (бланшировать), НАРЕЗАТЬ КУБИК 1 НА РОБОКОПЕ, расфасовать по вакуумам, выложить по лоткам
в пароконвектомат на режим 9 на 80 градусов НА ПАР, на 40 мин, затем РЕЗКО охладить в ванне с холодной водой и убрать в холодильную камеру.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8672,'Свекла очищенная Су-вид / Кубик 1х1 см',1297528,'Свеклу нарезают на робокопе кубиком 1х1 см, затем промывают в большом количестве холодной проточной воды, откинуть на перфорированный лоток и дать стечь влаге, 
фасуют в вакуум пакеты режим 9,конвектомат на 80 градусов НА ПАР,на 2 часа (НУЖНО СВАРИТЬ ДО ГОТОВНОСТИ!),затем охладить в холодной воде и убрать в холодильную камеру.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8672,'Свекла очищенная Су-вид / Кубик 1х1 см',1297537,'Свеклу нарезают на робокопе кубиком 1х1 см, затем промывают в большом количестве холодной проточной воды, откинуть на перфорированный лоток и дать стечь влаге, 
фасуют в вакуум пакеты режим 9,конвектомат на 80 градусов НА ПАР,на 2 часа (НУЖНО СВАРИТЬ ДО ГОТОВНОСТИ!),затем охладить в холодной воде и убрать в холодильную камеру.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8672,'Свекла очищенная Су-вид / Кубик 1х1 см',1298835,'Свеклу нарезают на робокопе кубиком 1х1 см, затем промывают в большом количестве холодной проточной воды, откинуть на перфорированный лоток и дать стечь влаге, 
фасуют в вакуум пакеты режим 9,конвектомат на 80 градусов НА ПАР,на 2 часа (НУЖНО СВАРИТЬ ДО ГОТОВНОСТИ!),затем охладить в холодной воде и убрать в холодильную камеру.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8776,'Рис японика / Фасовка',1297441,'фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(8823,'Кокосовое молоко / Перетаривание',1293625,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). Упаковку вскрыть, содержимое перетарить в гастроемкость. 
За некоторое время до использования кокосового молока выложить ингредиент из холодильной камеры, оставить при комнатной температуре.
После вскрытия упаковки - тщательно размешать содержимое, чтобы жидкость и мякоть смешались в однородную массу.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9220,'Сахарный сироп с мятой',1297485,'Мяту промыть, перебрать от гнили.
Все ингредиенты соединить и варить до полного растворения сахара (на небольшом объеме около 15 мин). Выпаривания 1/3 воды. постоянно помешивая. 
Затем смесь снять с плиты, отделить мяту от сиропа.
Сироп остудить.
Готовый сироп получается густым и тягучим, насыщенного темно-коричневого цвета. Вкус сбалансированный не приторный, освежающий.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9238,'Апельсиновая паприка',1298178,'Специи соединить и расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9271,'Йогурт греческий без наполнителя 7%/ Перетаривание',1293548,'Перетарка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9271,'Йогурт греческий без наполнителя 7%/ Перетаривание',1298865,'Перетарка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9271,'Йогурт греческий без наполнителя 7%/ Перетаривание',1298866,'Перетарка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9330,'Рыбный фарш из минтая',1298406,'Частично дефростированные (легко ломается в руках без усилия) филе минтая пропускают через мясорубку 2 (чтобы не было костей).
ВАЖНО !!! после того как закончили работу с мясорубкой ОБЯЗАТЕЛЬНО снимают детали - удаляют остатки фарша с деталей и внутри мясорубки, чтобы снизить % отхода.
Затем тщательно перемешивают полуфабрикат в фаршемешалке 7-10 минут. 
Готовый полуфабрикат фасуют в вакуумный пакет вместе с влаговпитывающей салфеткой.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9388,'Соевый соус с мирином',1295201,'Все ингредиенты соединить и тщательно перемешать до однородной консистенции.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9514,'Специи: карри, имбирь, куркума',1297442,'смешать и расфасовать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9549,'Заправка "Соя Кабуль" от Люсьена Оливье',1297314,'Мед используют жидкий, если он засахарен - нагревают до средне-жидкой консистенции. 
Затем добавляют пасту широ мисо и пасту кочудян. Затем добавляют масло. 
Тщательно перемешивают с помощью миксера до однородной консистенции.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9741,'Тунец консервированный целое филе / Перетаривание',1297548,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). Упаковку вскрыть, содержимое откинуть на сито, дать стечь маринаду.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9779,'Соус терияки / Перетаривание',1297305,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9816,'Филе грудки куриное Су-вид / 126 в 120 гр / Кубик 2х2см',1297441,'Куриное филе нарезают кубиком со сторонами 2см (на порцию 126 гр), маринуют маслом подсолнечным, затем вакуумируют.

Полуфабрикат доводят до готовности в пароконвектомате при t-60 град.С в режиме "ПАР" 180 минут / в котле 210 минут при температуре 60 С, далее куриное филе охлаждают, 
хранят в холодильной камере.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9849,'Домашний соус Цезарь с анчоусами и пармезаном',1293573,'Сыр пармезан предварительно пробить блендером в пудру.
Масло подсолнечное и оливковое вливают в охлажденные желтки тонкой струйкой, одновременно взбивая смесь блендером до однородной плотной консистенции, 
затем добавляют остальные игнредиенты. Повторно тщательно перемешивают. Консистенция должна быть однородной без кусочков сыра.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9849,'Домашний соус Цезарь с анчоусами и пармезаном',1294929,'Сыр пармезан предварительно пробить блендером в пудру.
Масло подсолнечное и оливковое вливают в охлажденные желтки тонкой струйкой, одновременно взбивая смесь блендером до однородной плотной консистенции, 
затем добавляют остальные игнредиенты. Повторно тщательно перемешивают. Консистенция должна быть однородной без кусочков сыра.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9850,'Маринованные огурцы со свит чили',1293473,'Предварительно приготовить маринад из масла подсолнечного, соли, перца, рисового уксуса, соуса чили. Ингредиенты тщательно перемешать
до растворения соли.
Огурцы перебрать и удалить непригодные к употреблению части, вымыть, обсушить, затем нарезать на робокопе кружками толщиной 0,8-1 мм, 
добавить маринад и тщательно перемешать.
Расфасовать огурцы дополняя остатками маринада.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9850,'Маринованные огурцы со свит чили',1294927,'Предварительно приготовить маринад из масла подсолнечного, соли, перца, рисового уксуса, соуса чили. Ингредиенты тщательно перемешать
до растворения соли.
Огурцы перебрать и удалить непригодные к употреблению части, вымыть, обсушить, затем нарезать на робокопе кружками толщиной 0,8-1 мм, 
добавить маринад и тщательно перемешать.
Расфасовать огурцы дополняя остатками маринада.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9850,'Маринованные огурцы со свит чили',1294931,'Предварительно приготовить маринад из масла подсолнечного, соли, перца, рисового уксуса, соуса чили. Ингредиенты тщательно перемешать
до растворения соли.
Огурцы перебрать и удалить непригодные к употреблению части, вымыть, обсушить, затем нарезать на робокопе кружками толщиной 0,8-1 мм, 
добавить маринад и тщательно перемешать.
Расфасовать огурцы дополняя остатками маринада.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9850,'Маринованные огурцы со свит чили',1299208,'Предварительно приготовить маринад из масла подсолнечного, соли, перца, рисового уксуса, соуса чили. Ингредиенты тщательно перемешать
до растворения соли.
Огурцы перебрать и удалить непригодные к употреблению части, вымыть, обсушить, затем нарезать на робокопе кружками толщиной 0,8-1 мм, 
добавить маринад и тщательно перемешать.
Расфасовать огурцы дополняя остатками маринада.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9851,'Маринованный редис в масле',1293473,'Редис перебрать и удалить непригодные к употреблению части, вымыть, обсушить, затем нарезать кружками толщиной 0,8-1 мм, добавить соль, перец дроблённый,
масло подсолнечное и перемешать. 
1) На порцию 20 гр расфасовать 20 гр редиса без жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9851,'Маринованный редис в масле',1294927,'Редис перебрать и удалить непригодные к употреблению части, вымыть, обсушить, затем нарезать кружками толщиной 0,8-1 мм, добавить соль, перец дроблённый,
масло подсолнечное и перемешать. 
1) На порцию 20 гр расфасовать 20 гр редиса без жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9851,'Маринованный редис в масле',1294931,'Редис перебрать и удалить непригодные к употреблению части, вымыть, обсушить, затем нарезать кружками толщиной 0,8-1 мм, добавить соль, перец дроблённый,
масло подсолнечное и перемешать. 
1) На порцию 20 гр расфасовать 20 гр редиса без жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9851,'Маринованный редис в масле',1298406,'Редис перебрать и удалить непригодные к употреблению части, вымыть, обсушить, затем нарезать кружками толщиной 0,8-1 мм, добавить соль, перец дроблённый,
масло подсолнечное и перемешать. 
1) На порцию 20 гр расфасовать 20 гр редиса без жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9926,'Омлет яичный на крахмале',1293547,'Подготовить миски, сковороду диаметром 30 см, венчик, лопатку, пергамент.

Крахмал предварительно отдельно соединить с водой, тщательно перемешать венчиком.
Все компоненты соединить и перемешать до однородной консистенции венчиком. 
Подготовленную сковороду разогреть на плите, добавить растительно масло, затем залить омлетную массу по 75 гр на сковороду, 
омлет обжарить с 1 стороны на среднем огне 2,5мин, далее выложить омлет на пергамент с помощью лопатки и дать остыть.	
1 порция = 75 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9929,'Основа для супа Том-Ям',1293619,'Пряный бульон том-ям соединяем с пастой том-ям, тщательно перемешиваем и доводим до кипения, затем снижаем на минимум огонь
на плите и добавляем кокосовое молоко и заправку, провариваем несколько минут, не позволяя супу кипеть, 
повторно перемашиваем до однородной консистенции, снимаем с плиты и остужаем полуфабрикат.						') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9930,'Креветки Су-вид без хвостов для кафе',1293473,'У креветок УДАЛИТЬ ХВОСТЫ, распорционировать 20 креветок общим весом по 290 г !

Подготовленные креветки заправить маслом 
растительным, аккуратно перемешать, и выложить в  
пакет вакуумный, завакуумировать.   

Подготовленные креветки варить в пароконвектомате 
при t-57град.С в течение 20мин. 
Остудить в камере для охлаждения . 1 готовая порция = 250 гр.

Готовые охлажденные креветки переложить в гастроемкость, вскрыв вак упаковки, накрыть крышкой или пленкой и проставить маркировку 
(наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Затем фасовать по нужному количеству грамм в порции.

1) на порцию 35 гр готовых креветок - фасуют 3 креветки.
2) на порцию 60 гр готовых креветок - фасуют 5-6 креветок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9930,'Креветки Су-вид без хвостов для кафе',1293619,'У креветок УДАЛИТЬ ХВОСТЫ, распорционировать 20 креветок общим весом по 290 г !

Подготовленные креветки заправить маслом 
растительным, аккуратно перемешать, и выложить в  
пакет вакуумный, завакуумировать.   

Подготовленные креветки варить в пароконвектомате 
при t-57град.С в течение 20мин. 
Остудить в камере для охлаждения . 1 готовая порция = 250 гр.

Готовые охлажденные креветки переложить в гастроемкость, вскрыв вак упаковки, накрыть крышкой или пленкой и проставить маркировку 
(наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Затем фасовать по нужному количеству грамм в порции.

1) на порцию 35 гр готовых креветок - фасуют 3 креветки.
2) на порцию 60 гр готовых креветок - фасуют 5-6 креветок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9930,'Креветки Су-вид без хвостов для кафе',1294927,'У креветок УДАЛИТЬ ХВОСТЫ, распорционировать 20 креветок общим весом по 290 г !

Подготовленные креветки заправить маслом 
растительным, аккуратно перемешать, и выложить в  
пакет вакуумный, завакуумировать.   

Подготовленные креветки варить в пароконвектомате 
при t-57град.С в течение 20мин. 
Остудить в камере для охлаждения . 1 готовая порция = 250 гр.

Готовые охлажденные креветки переложить в гастроемкость, вскрыв вак упаковки, накрыть крышкой или пленкой и проставить маркировку 
(наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Затем фасовать по нужному количеству грамм в порции.

1) на порцию 35 гр готовых креветок - фасуют 3 креветки.
2) на порцию 60 гр готовых креветок - фасуют 5-6 креветок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9930,'Креветки Су-вид без хвостов для кафе',1294931,'У креветок УДАЛИТЬ ХВОСТЫ, распорционировать 20 креветок общим весом по 290 г !

Подготовленные креветки заправить маслом 
растительным, аккуратно перемешать, и выложить в  
пакет вакуумный, завакуумировать.   

Подготовленные креветки варить в пароконвектомате 
при t-57град.С в течение 20мин. 
Остудить в камере для охлаждения . 1 готовая порция = 250 гр.

Готовые охлажденные креветки переложить в гастроемкость, вскрыв вак упаковки, накрыть крышкой или пленкой и проставить маркировку 
(наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Затем фасовать по нужному количеству грамм в порции.

1) на порцию 35 гр готовых креветок - фасуют 3 креветки.
2) на порцию 60 гр готовых креветок - фасуют 5-6 креветок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9930,'Креветки Су-вид без хвостов для кафе',1298832,'У креветок УДАЛИТЬ ХВОСТЫ, распорционировать 20 креветок общим весом по 290 г !

Подготовленные креветки заправить маслом 
растительным, аккуратно перемешать, и выложить в  
пакет вакуумный, завакуумировать.   

Подготовленные креветки варить в пароконвектомате 
при t-57град.С в течение 20мин. 
Остудить в камере для охлаждения . 1 готовая порция = 250 гр.

Готовые охлажденные креветки переложить в гастроемкость, вскрыв вак упаковки, накрыть крышкой или пленкой и проставить маркировку 
(наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Затем фасовать по нужному количеству грамм в порции.

1) на порцию 35 гр готовых креветок - фасуют 3 креветки.
2) на порцию 60 гр готовых креветок - фасуют 5-6 креветок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9932,'Микс орехов и специй: суш лук, семечки подсолнечника, миндаль, дукка',1293621,'Фундук и миндаль мелко порубить до консистенции кусочки фракций. Все компоненты соединить и тщательно перемешать до однородной консистенции.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9932,'Микс орехов и специй: суш лук, семечки подсолнечника, миндаль, дукка',1294926,'Фундук и миндаль мелко порубить до консистенции кусочки фракций. Все компоненты соединить и тщательно перемешать до однородной консистенции.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9934,'Галета 4 сыра на песочном тесте',1293531,'Дорблю раскрошить мелко руками.
Полуфабрикат тесто песочное выложить на пергамент, раскатать тесто руками округлой формы (не скалкой) d=16 см, галету на пергаменте выложить на противень,
противень с галетой  местами проткнуть вилкой и запекать в конвктомате при температуре 180 С - 7 минут, затем на поверхность теста нанести творожным сыром, 
посыпать моцареллой и пармезаном (дорблю позже), бортики смазать яичным желток и выпекать в конвектомате еще 5 минут. 
Затем на готовую галету покрошить дорблю и миндаль.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9942,'Основа для тыквенного супа без кокосового молока',1293625,'Подготовленные овощи нарезать кубик 1,0х1,0см. В глубокой кастрюле с добавлением растительного масла обжарить морковь, сельдерей, 
тыкву, все перемешать и продолжить жарить до светло-золотистого цвета. 
Затем, добавить воду, перемешать и тушить до готовности овощей (около 40 минут), при постоянном помешивании (чтобы не пригорело). 
Готовые вареные овощи ТЩАТЕЛЬНО измельчить блендером до однородной ШЕЛКОВОЙ консистенции, добавить СОЛЬ по вкусу, тщательно перемешать, довести до кипения, 
проварить в течение 1 мин, снять с плиты, остудить.  ') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9947,'Паста пенне Pasteroni вареная',1293551,'Пасту сварить в кипящей подсоленной воде  в течение 6 мин 
до состояния "альденте",  воду слить, пасту откинуть на сито, 
промыть холодной кипяченой водой , дать хорошо стечь.   

Готовую вареную пасту заправить растительным  маслом и 
аккуратно перемешать.   
Готовую заправленную пасту распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9949,'Бланшированная кукуруза',1293473,'Кукурузу с/м не размораживают, откидывают на сито, ошпаривают кипятком, дают хорошо стечь лишней жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9949,'Бланшированная кукуруза',1294927,'Кукурузу с/м не размораживают, откидывают на сито, ошпаривают кипятком, дают хорошо стечь лишней жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9949,'Бланшированная кукуруза',1294931,'Кукурузу с/м не размораживают, откидывают на сито, ошпаривают кипятком, дают хорошо стечь лишней жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9949,'Бланшированная кукуруза',1298832,'Кукурузу с/м не размораживают, откидывают на сито, ошпаривают кипятком, дают хорошо стечь лишней жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9955,'Помидоры черри запеченные (целиком)',1293619,'Подготовленные помидоры перемешивают с подсолнечным маслом, выкладывают в гастроёмкость в один слой и запекают в разогретом пароконвектомате до 250 °C - 5 минут, 
форма помидоров должна быть сохранена (не в кашу).
На порцию 20 гр у клиента фасовать по 2-3 шт.
на порцию 30 гр у клиента фасовать по 4-5 шт.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9955,'Помидоры черри запеченные (целиком)',1297320,'Подготовленные помидоры перемешивают с подсолнечным маслом, выкладывают в гастроёмкость в один слой и запекают в разогретом пароконвектомате до 250 °C - 5 минут, 
форма помидоров должна быть сохранена (не в кашу).
На порцию 20 гр у клиента фасовать по 2-3 шт.
на порцию 30 гр у клиента фасовать по 4-5 шт.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9955,'Помидоры черри запеченные (целиком)',1298770,'Подготовленные помидоры перемешивают с подсолнечным маслом, выкладывают в гастроёмкость в один слой и запекают в разогретом пароконвектомате до 250 °C - 5 минут, 
форма помидоров должна быть сохранена (не в кашу).
На порцию 20 гр у клиента фасовать по 2-3 шт.
на порцию 30 гр у клиента фасовать по 4-5 шт.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9955,'Помидоры черри запеченные (целиком)',1299309,'Подготовленные помидоры перемешивают с подсолнечным маслом, выкладывают в гастроёмкость в один слой и запекают в разогретом пароконвектомате до 250 °C - 5 минут, 
форма помидоров должна быть сохранена (не в кашу).
На порцию 20 гр у клиента фасовать по 2-3 шт.
на порцию 30 гр у клиента фасовать по 4-5 шт.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9956,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см',1293619,'Готовую охлажденную курицу су-вид переложить в гастроемкость, вскрыв вак упаковки, накрыть крышкой или пленкой и проставить маркировку 
(наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Затем фасовать по нужному количеству грамм в порции.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9956,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см',1298407,'Готовую охлажденную курицу су-вид переложить в гастроемкость, вскрыв вак упаковки, накрыть крышкой или пленкой и проставить маркировку 
(наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Затем фасовать по нужному количеству грамм в порции.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9958,'Микс крошки: кунжутная халва, семена чиа',1293546,'Халву извлекают из производственной упаковки, мелко нарезают ножом "в крошку".
Ингредиенты соединяют, перемешивают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9958,'Микс крошки: кунжутная халва, семена чиа',1297319,'Халву извлекают из производственной упаковки, мелко нарезают ножом "в крошку".
Ингредиенты соединяют, перемешивают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9958,'Микс крошки: кунжутная халва, семена чиа',1299207,'Халву извлекают из производственной упаковки, мелко нарезают ножом "в крошку".
Ингредиенты соединяют, перемешивают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9959,'Вареные яйца вкрутую без скорлупы',1293550,'Яйца куриные перебрать (удалить битые, с трещинами). Важно использовать яйца не холодные, комнатной температуры! 
Готовить (варить) яйца куриные в пароконвектоматепри t- 100град.С в течение 20-25мин до готовности, затем яйца сразу же остудить в ледяной воде!
Когда куриные яйца остынут - очистить от скорлупы.

ВАЖНО! На порцию 80 гр расфасовать 3 половинки (разрезать вдоль пополам, фасовать по половинкам)') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9959,'Вареные яйца вкрутую без скорлупы',1298865,'Яйца куриные перебрать (удалить битые, с трещинами). Важно использовать яйца не холодные, комнатной температуры! 
Готовить (варить) яйца куриные в пароконвектоматепри t- 100град.С в течение 20-25мин до готовности, затем яйца сразу же остудить в ледяной воде!
Когда куриные яйца остынут - очистить от скорлупы.

ВАЖНО! На порцию 80 гр расфасовать 3 половинки (разрезать вдоль пополам, фасовать по половинкам)') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9959,'Вареные яйца вкрутую без скорлупы',1298866,'Яйца куриные перебрать (удалить битые, с трещинами). Важно использовать яйца не холодные, комнатной температуры! 
Готовить (варить) яйца куриные в пароконвектоматепри t- 100град.С в течение 20-25мин до готовности, затем яйца сразу же остудить в ледяной воде!
Когда куриные яйца остынут - очистить от скорлупы.

ВАЖНО! На порцию 80 гр расфасовать 3 половинки (разрезать вдоль пополам, фасовать по половинкам)') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9960,'Авокадо-крем (больше авокадо)',1293473,'Смешивают желтки, масло  вливают тонкой струйкой, одновременно взбивая смесь блендером до однородной плотной консистенции майонеза, затем добавляют гуакомоле и соль, тщательно перемешивают и порционируют.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9961,'Шоколадная гранола',1293548,'Все компоненты соединить, тщательно перемешать до однородной консистенции. Подготовленную смесь выложить на лист (с пергаментом) равномерно тонким слоем по 605 гр на 1 противень, 
и сушить в пароконвектомате (режим конвекция) при t- 160 град.С в течение 10 мин, затем перемешать и запекать еще 15 минут до полного высыхания. 
Готовые мюсли остудить, хорошо перемешать, при необходимости разбить крупные слипшиеся кусочки на мелкие, повторно встряхнуть в емкости при фасовке.

ВАЖНО! после остывания:				
- текстура: полностью хрустящая, без мягких фрагментов (и тем более без влажных!)				
- вкус: сладкий, шоколадный, важно следить что БЕЗ привкуса подгоревшего!				') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9962,'Шоко-кукис на сиропе топинамбура',1293634,'Нут тщательно промытый и без жидкости смешать с остальными ингрединтами (КРОМЕ ШОКОЛАДА), перебить в блендере до однородной массы БЕЗ крупинок,					
получившееся тесто из нута охладить в холодильнике 30 минут.			
						
Затем из охлажденного теста сформировать кукисы: взять 75 г теста, быстро сформировать шар, выложить на противень с пергаментом, "приплюснуть" шар до толщины 1 см.					
На каждый кукис выложить по 10 г шоколадных капель. Противень с кукисами поместить в разогретый конвектомат, выпекать полуфабрикат при 180С в течение 18 минут.
					
В ГОРЯЧЕМ виде подровнять форму кольцом, ПОЛНОСТЬЮ остудить на ровной поверхности, только после этого перемещать (фасовать в другие емкости). Средний вес 1 готового кукис = 70 гр.				') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(9995,'Цитрусовая соль: розовая соль, лимонный перец, цедра апельсина, базилик',1297307,'Все перемешать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(10154,'Взбитый кремчиз со сливками (без сахара) 3:1',1297548,'Ингредиенты соединяют с помощью миксера до однородной консистенции. Готовый полуфабрикат порционируют и хранят в холодильной камере.
Фасовка 20 гр для кафе: готовый соус выкладывают в кондитерский мешок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(10154,'Взбитый кремчиз со сливками (без сахара) 3:1',1298838,'Ингредиенты соединяют с помощью миксера до однородной консистенции. Готовый полуфабрикат порционируют и хранят в холодильной камере.
Фасовка 20 гр для кафе: готовый соус выкладывают в кондитерский мешок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(10154,'Взбитый кремчиз со сливками (без сахара) 3:1',1298966,'Ингредиенты соединяют с помощью миксера до однородной консистенции. Готовый полуфабрикат порционируют и хранят в холодильной камере.
Фасовка 20 гр для кафе: готовый соус выкладывают в кондитерский мешок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(10154,'Взбитый кремчиз со сливками (без сахара) 3:1',1299208,'Ингредиенты соединяют с помощью миксера до однородной консистенции. Готовый полуфабрикат порционируют и хранят в холодильной камере.
Фасовка 20 гр для кафе: готовый соус выкладывают в кондитерский мешок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(10154,'Взбитый кремчиз со сливками (без сахара) 3:1',1299287,'Ингредиенты соединяют с помощью миксера до однородной консистенции. Готовый полуфабрикат порционируют и хранят в холодильной камере.
Фасовка 20 гр для кафе: готовый соус выкладывают в кондитерский мешок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(10401,'Тортилья 25 см УД / Целая',1298865,'Тортилью сложить пополам, расфасовать по бопп-пакетам.
Средний вес = 65 гр/шт.
Учтен % на перевес.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(10551,'Ванильное печенье в подарок УД / Фасовка',1297875,'1 печенье = 20 гр. Фасовать по 2 шт.
Для Elementaree наклеить наклейку 58х58 мм по ссылке из файла https://docs.google.com/spreadsheets/d/1RikTq-NJ61KxwtveiDaFZkW75fNW4MhgxDge3seszCc/edit?gid=463712123#gid=463712123') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(10560,'Рис жасмин УД / Фасовка',1299211,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11016,'Шпинат листовой с/м / Не размораживать',1299211,'Фасовка
Средний вес одного шарика 18гр, вес колеблется от 16 до 20 гр.
Учтен % перевеса') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11112,'Мясное рагу болоньезе с кусочками томатов / Фасовка',1293551,'Пакет с рагу ДХ Мясное рагу болоньезе с кусочками томатов (460 гр) рассчитан на 4 порции по 115 гр.
Пакет вскрыть и распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11114,'Лимонная пастрома из курицы маринованная с пряностями / Фасовка',1293621,'Пакет с ДХ Лимонная пастрома из курицы маринованная с пряностями (400 гр) рассчитан на 4 порции по 100 гр. Пакет вскрыть и распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11114,'Лимонная пастрома из курицы маринованная с пряностями / Фасовка',1294926,'Пакет с ДХ Лимонная пастрома из курицы маринованная с пряностями (400 гр) рассчитан на 4 порции по 100 гр. Пакет вскрыть и распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11116,'Пастрома из курицы с пряностями и медом / Слайсы',1293573,'Пакет с ДХ Пастрома из курицы маринованная с пряностями и медом (240 гр) рассчитан на:
- 4 порции по 60 гр
- 3 порции по 80 гр
Пакет вскрыть, цельное филе нарезать на слайсере ломтиками толщиной 0,6 см и распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11116,'Пастрома из курицы с пряностями и медом / Слайсы',1294929,'Пакет с ДХ Пастрома из курицы маринованная с пряностями и медом (240 гр) рассчитан на:
- 4 порции по 60 гр
- 3 порции по 80 гр
Пакет вскрыть, цельное филе нарезать на слайсере ломтиками толщиной 0,6 см и распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11118,'Томленая говядина в перечном соусе / Фасовка',1293533,'Пакет с ДХ Томленая говядина в перечном соусе (600 гр) рассчитан на 4 порции по 150 гр. Пакет вскрыть и распорционировать.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11131,'Сливочная начинка без лосося',1293547,'Рукколу перебрать, удалить непригодные к употреблению части.
Творожный сыр соединить со сливками и зеленью, тщательно измельчить с помощью блендера, затем смешать со слабосоленым лососем кубик 1х1 см 60 гр (взяв его из ДХ) 
до равномерного распределения лосося.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11132,'Слабосоленый лосось кубик 1х1 см для сливочной начинки',1293547,'открыть пакет, взять 15 гр для сливочной начинки') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11140,'Риет из тунца (с творогом)',1295229,'Пробиваем творог с кремчизом. добавляем тунец и каперсы рубленные и перемешиваем.
Консистенция должна быть кремовая с включениями тунца и каперсов.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11259,'Паста из трав с чесноком (петрушка+чеснок)',1294926,'Петрушку бланшировать в кипятке 30 секунд, пробить в стакане  с чесноком и подсолнечным маслом блендером') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11275,'Банана-кейк',1293534,'У подготовленного натертого имбиря выжать сок.
В ковш (или кастрюлю)  добавить сахар, патоку, специи для коврижки, воду, имбирную воду. Смесь довести до кипения, добавить соду (масса поднимется в 3 раза будет пена), 
размешивать 30 секунд, добавить муку.

Отдельно в миске размять банан, соединить с яйцом и взбить, затем добавить к массе с патокой.

Форму для кекса застелить пергаментом (чтоб не появилось острой сухой макушки)
вылить тесто 900-905 гр в форму 25 смх10,5 смх7,5 см.

Нагреть конвектомат до 160 С, выпечь кекс: 160 градусов - 30 минут, затем 150 градусов - 20 минут, далее 120 градусов - 20 минут, 
кекс должен быть готов: в толще не сырой и не высох снаружи.
Важно: после 15 минут выпекания нужно сделать несколько проколов.

Готовый кекс остудить 30 минут в камере шоковой заморозки (в форме для выпечки), затем вынуть из формы, развернуть пергамент и оставить при комнатной температуре 30 минут.
Масса готового кекса 815 г.

Срезать с обоих краев кекса по 1 см = примерно 50-55 гр - % обрезков учтен в суммарном выходе.
Готовый кекс нарезать кусками 2,5 см и весом 85-87 гр - кусочки не должны крошиться!

Упаковать в дуэко800: 4-5 кусочков, закрыть крышкой, она не должна придавливает, бокс не пустой.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11295,'Галета 4 сыра на песочном тесте Вер1',1295007,'Дорблю раскрошить мелко руками.
Полуфабрикат тесто песочное выложить на пергамент, раскатать тесто руками округлой формы (не скалкой) d=9 см, раскатать, загнуть края. галету на пергаменте выложить на противень,
противень с галетой  местами проткнуть вилкой и запекать в конвктомате при температуре 180 С - 7 минут, затем на поверхность теста нанести творожным сыром, 
посыпать моцареллой и пармезаном (дорблю позже), бортики смазать яичным желток , покрошить дорблю и миндаль и выпекать в конвектомате еще 5 минут. 
готовая галета d= 11см ') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11380,'Итальянская фриттата',1295153,'Подготовленную омлетную массу с травами налить в прямоугольную форму для выпечки 720 гр. Запекать в пароконвектомате при t- 180град.С 
в течение 25 мин до светло-золотистого цвета до готовности. Остудить. Выход готового блюда 660гр, режем на три квадратных куска по 220гр. 
Готовое блюдо закрыть плотно крышкой и убрать в холодильную камеру.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11391,'Готовые сырники для кафе 50 гр/шт',1295222,'Сырники из камеры шоковой заморозки не требуют дефростации перед обжаркой!

На разогретой до 150 градусов сковороде прогревают подсолнечное масло, обжаривают сырники с двух сторон до золотистого коллера по 20-40 секунд на сторону,
выкладывают обжаренные сырники на противень с пергаментом.
Далее в разогретый до 160 градусов пароконвектомат (режим "ЖАР") загружают противень с сырниками на 9 минут.
После приготовления: оставляют сырники при комнатной температуре на 15 минут для стабилизации массы
и охлаждают до температуры в толще продукта +4-2 С.

На порцию 150 гр фасуют по 3 сырника.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11430,'Овсяная каша готовая',1005000,'Овсяные хлопья отваривают на молоке вместе с солью, корицей, остужают, выкладывают в супницу.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11430,'Овсяная каша готовая',1295466,'Овсяные хлопья отваривают на молоке вместе с солью, корицей, остужают, выкладывают в супницу.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11430,'Овсяная каша готовая',1297318,'Овсяные хлопья отваривают на молоке вместе с солью, корицей, остужают, выкладывают в супницу.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11430,'Овсяная каша готовая',1299206,'Овсяные хлопья отваривают на молоке вместе с солью, корицей, остужают, выкладывают в супницу.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11431,'Запеченная кабачковая вафля',1295229,'Вафли запечь в конвектомате до готовности. Остудить и расфасовать.
1 шт = 70 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11432,'Запеченные цуккини',1295229,'Цуккини гриль дефростируют.
Выкладывают на противень с пергаментом и запекают до готовности в конвектомате. Остужают и порционируют.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11433,'Вареный булгур со специями',1295194,'Булгур в сотейнике залить кипятком в пропорции 1:1,5 варить на слабом огне на плите под крышкой 10 минут. Готовый вареный булгур откинуть на сито, дать хорошо стечь. НЕ промывать!

') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11435,'Запеченная индейка филе с базиликом и тимьяном  / Слайсы',1295193,'Пакет с ДХ Запеченная индейка филе с базиликом и тимьяном (360 гр) рассчитан на 3 порции по 120 гр. Пакет вскрыть, нарезать на слайсы 0.5-1 см, распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11435,'Запеченная индейка филе с базиликом и тимьяном  / Слайсы',1297308,'Пакет с ДХ Запеченная индейка филе с базиликом и тимьяном (360 гр) рассчитан на 3 порции по 120 гр. Пакет вскрыть, нарезать на слайсы 0.5-1 см, распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11435,'Запеченная индейка филе с базиликом и тимьяном  / Слайсы',1299288,'Пакет с ДХ Запеченная индейка филе с базиликом и тимьяном (360 гр) рассчитан на 3 порции по 120 гр. Пакет вскрыть, нарезать на слайсы 0.5-1 см, распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11437,'Кебабы из курицы / Фасовка',1295194,'Пакет с ДХ Заготовка для кебабов из курицы (630 гр) рассчитан на 3 порции по 210 гр в сыром виде. Пакет вскрыть.
ЗАМОРОЖЕННЫЕ кебабы выкладывают на противень (с пергаментом) и запекают в пароконвектомате при t- 180град. в течение 20мин. 
Остужают и порционирую, закрывают плотно крышкой. Выход 1 готового полуфабриката = 75 гр. В порции 2 шт.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11440,'Куриный шашлычок в панировке из специй / Фасовка',1295201,'Пакет с ДХ Куриный шашлычок в панировке из специй (450 гр) рассчитан на 3 порции по 150 гр. 
Мясо дефростируют в пакете, затем пакет вскрывают и распределяют по 150 гр на шпажку (из расчета 1 шпажка на порцию), 
равномерно обжаривают на сковороде около 1 минуты до золотистой корочки.
ВАЖНО! Расстояние на сковороде между шашлыками не менее 2-3 см, чтобы они не тушились, а жарились!

Затем шашлычки выкладывают на противень (с пергаментом) и запекают при t- 200 град.С в течение 10 мин до готовности. 
Полуфабрикат остужают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11543,'Брауни / Фасовка',1295379,'Пакет с ДХ Брауни (280 гр) рассчитан на 4 порции по 70 гр.
Пакет вскрыть и распорционировать.
Наклеить наклейку 58х58 мм по ссылке из файла https://docs.google.com/spreadsheets/d/1RikTq-NJ61KxwtveiDaFZkW75fNW4MhgxDge3seszCc/edit?gid=463712123#gid=463712123') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11543,'Брауни / Фасовка',1297874,'Пакет с ДХ Брауни (280 гр) рассчитан на 4 порции по 70 гр.
Пакет вскрыть и распорционировать.
Наклеить наклейку 58х58 мм по ссылке из файла https://docs.google.com/spreadsheets/d/1RikTq-NJ61KxwtveiDaFZkW75fNW4MhgxDge3seszCc/edit?gid=463712123#gid=463712123') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11568,'Зеленый смузи / Фасовка',1294854,'Фасовка 1 порция') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11569,'Ананасовый Баунти / Фасовка',1294855,'Фасовка 1 порция') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11570,'Смузи Клубника-Банан / Фасовка',1294856,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11571,'Смузи Облепиха / Фасовка',1294857,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11572,'Смузи Черника-Смородина / Фасовка',1294858,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11575,'Заатар зеленый по-палестински / Фасовка',1297308,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11606,'Смузи "Тайское Манго" / Фасовка',1295825,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11799,'Чай синий цветочный Анчан',1297485,'На порцию 1 гр: СТРОГО фасуют по 3-4 цветочка - 0,4 гр фактически!
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11813,'Картофель запеченный / Кубик 2х2 см',1293533,'Картофель НАРЕЗАТЬ КУБИК 2х2 см НА РОБОКОПЕ  ,промыть в большом количестве холодной проточной воды, откинуть на перфорированный лоток и дать стечь влаге, 
далее перемешать с солью, базиликом и маслом, выложить на противень с пергаментом и запечь в конвектомате на 180 градусов (конвекция) на 20-30 минут до золотистого коллера и готовности,
затем полуфабрикат остудить и хранить в холодильной камере.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(11949,'Чай-лимонад с облепихой / Фасовка',1297057,'Фасовка 1 порция') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12016,'Тимьян свежий / Перебрать',1299289,'Удалить непригодные к употреблению части') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12035,'Основа для супа том кха',1297320,'Пряный бульон том-ям соединяем с пастой том кха, тщательно перемешиваем и доводим до кипения, затем снижаем на минимум огонь
на плите и добавляем кокосовое молоко, лимонную заправку, рыбный соус и куркуму, провариваем несколько минут, не позволяя супу кипеть, 
повторно перемашиваем до однородной консистенции, снимаем с плиты и остужаем полуфабрикат.		
нам нужен желтовалтый бульон, при необходимости добавляем ещё куркуму 				') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12035,'Основа для супа том кха',1299309,'Пряный бульон том-ям соединяем с пастой том кха, тщательно перемешиваем и доводим до кипения, затем снижаем на минимум огонь
на плите и добавляем кокосовое молоко, лимонную заправку, рыбный соус и куркуму, провариваем несколько минут, не позволяя супу кипеть, 
повторно перемашиваем до однородной консистенции, снимаем с плиты и остужаем полуфабрикат.		
нам нужен желтовалтый бульон, при необходимости добавляем ещё куркуму 				') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12037,'Запеченная курица филе со специями / Фасовка',1297305,'Маринованное филе грудки выкладывают на противень (с пергаментом). 
Конвектомат прогревают до 180 С, на противень с бумагой для выпечки выкладывают подготовленное филе, запекают около 10 мин до готовности.

Пакет с ДХ Курица филе грудки в специях / Средние кусочки / Кубик 2х2 см (480 гр) рассчитан на 3 порции по 160 гр продукта в сыром виде и 120 гр в готовом виде.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12039,'Готовые фрикадельки из курицы / Фасовка',1297306,'ЗАМОРОЖЕНЫЕ фрикадельки выложить на противень (с пергаментом) и запекать в пароконвектомате при t- 180град.С в течение 10 мин.
Остудить и распорционировать, закрыть плотно крышкой. Выход 1 готового полуфабриката = 50 гр. В порции 3 шт.

Пакет с ДХ Фрикадельки из курицы (540 гр) рассчитан на 3 порции по 180 гр продукта в сыром виде и 150 гр в готовом виде.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12039,'Готовые фрикадельки из курицы / Фасовка',1298418,'ЗАМОРОЖЕНЫЕ фрикадельки выложить на противень (с пергаментом) и запекать в пароконвектомате при t- 180град.С в течение 10 мин.
Остудить и распорционировать, закрыть плотно крышкой. Выход 1 готового полуфабриката = 50 гр. В порции 3 шт.

Пакет с ДХ Фрикадельки из курицы (540 гр) рассчитан на 3 порции по 180 гр продукта в сыром виде и 150 гр в готовом виде.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12042,'Запеченная курица филе с орегано и лимоном / Слайсы',1297307,'Пакет с ДХ Запеченное филе курицы в лимонном маринаде (450 гр) рассчитан на 3 порции по 150 гр. Пакет вскрыть, нарезать на слайсы 0.5-1 см, распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12047,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см / Фасовка 50 гр',1297320,'Пакет с ДХ Филе грудки куриное Су-вид для кафе / Кубик 1х1см (150 гр) рассчитан на 3 порции по 50 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12079,'Кунжутный микс специй: микс кунжута, лимонный перец, сушёный лук, имбирь, перец',1297441,'всё смешать. фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12127,'Вкусовая добавка эликсира Уэнсдей с огурцом',1297485,'Все ингредиенты соединяют и измельчают до однородной консистенции с помощью блендера.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12135,'Зелёный бульон',1298407,'ВАЖНО! Соблюдать последовательность действий для сохранения яркости цвета.
Пробить шпинат, базилик с чесноком и красным луком, с водой, прогреть получившуюся смесь, довести до кипения, затем тщательно процедить.
Полуфабрикат остудить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12136,'ДХ Основа для лимонада "Чёрный цитрус"  (1000 гр)',1297503,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12246,'Зажарка из моркови с луком',1297528,'Репчатый лук нарезают на робокопе кубиком 1х1 см.
В раскаленную глубокую сковороду или кастрюлю наливают масло, добавляют овощи, обжаривают до готовности, в конце добавляют томат пасту и тушат несколько минут, 
добавляют перец и соль. Овощи не должны быть пресными и не должны быть пересолеными. Готовый полуфабрикат остужают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12254,'Морковный суп для кафе с кокосовым молоком',1297545,'произвольно нарезаем репчатый лук (можно на четвертинки) обжариваем на сковороде в масле  до красивого золотистого цвета. 
В подготовленную основу для морковного супа добавляют лук,  кокосовое молоко, апельсиновый сок, имбирь, тщательно перемешивают с помощью блендера до равномерной консистенции, затем повторно прогревают, 
не доводя до кипения, затем снимают с плиты и остужают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12256,'Крем-суп из шампиньонов для кафе',1297546,'В подготовленную гри бную основу, добавляем сливки и трювельное масло, листики тимьяна взбиваем  с помощью блендера до равномерной консистенции, затем повторно прогревают, 
не доводя до кипения, затем снимают с плиты и остужают.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12257,'Основа для супа куриная лапша',1297547,'ДХ куриного бульона 1 л - рассчитано на 4 порции по 250 мл.
Бульон дефростировать, разлить указанное кол-во гр в порции.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12258,'Бланшированные бобы эдамаме',1297305,'Бобы бланшировать в кипящей воде в течение 30-40сек.
Далее, бобы откинуть на сито, промыть холодной КИПЯЧЕННОЙ водой, дать
хорошо стечь лишней жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12258,'Бланшированные бобы эдамаме',1299209,'Бобы бланшировать в кипящей воде в течение 30-40сек.
Далее, бобы откинуть на сито, промыть холодной КИПЯЧЕННОЙ водой, дать
хорошо стечь лишней жидкости.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12265,'Вареный рис Японика в пароварке',1297548,'Рис "японика" промывают через сито в холодной воде до прозрачности воды, дают воде стечь.
Перекладывают рис в рисоварку, заливают водой, на 2 кг риса - 2,3 л воды, нажимают кнопку включения.
Доводят рис до готовности, вода в пароварке должна полностью выпариться (примерно 15 мин), рис должен быть полностью готов.
Затем рисоварку выключают, перемешивают рис не касаясь дна. Закрывают крышкой и оставляют рис ещё на 25 минут в выключенной рисоварке (допаривание).') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12265,'Вареный рис Японика в пароварке',1299208,'Рис "японика" промывают через сито в холодной воде до прозрачности воды, дают воде стечь.
Перекладывают рис в рисоварку, заливают водой, на 2 кг риса - 2,3 л воды, нажимают кнопку включения.
Доводят рис до готовности, вода в пароварке должна полностью выпариться (примерно 15 мин), рис должен быть полностью готов.
Затем рисоварку выключают, перемешивают рис не касаясь дна. Закрывают крышкой и оставляют рис ещё на 25 минут в выключенной рисоварке (допаривание).') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12265,'Вареный рис Японика в пароварке',1299211,'Рис "японика" промывают через сито в холодной воде до прозрачности воды, дают воде стечь.
Перекладывают рис в рисоварку, заливают водой, на 2 кг риса - 2,3 л воды, нажимают кнопку включения.
Доводят рис до готовности, вода в пароварке должна полностью выпариться (примерно 15 мин), рис должен быть полностью готов.
Затем рисоварку выключают, перемешивают рис не касаясь дна. Закрывают крышкой и оставляют рис ещё на 25 минут в выключенной рисоварке (допаривание).') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12265,'Вареный рис Японика в пароварке',1299287,'Рис "японика" промывают через сито в холодной воде до прозрачности воды, дают воде стечь.
Перекладывают рис в рисоварку, заливают водой, на 2 кг риса - 2,3 л воды, нажимают кнопку включения.
Доводят рис до готовности, вода в пароварке должна полностью выпариться (примерно 15 мин), рис должен быть полностью готов.
Затем рисоварку выключают, перемешивают рис не касаясь дна. Закрывают крышкой и оставляют рис ещё на 25 минут в выключенной рисоварке (допаривание).') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12265,'Вареный рис Японика в пароварке',1299309,'Рис "японика" промывают через сито в холодной воде до прозрачности воды, дают воде стечь.
Перекладывают рис в рисоварку, заливают водой, на 2 кг риса - 2,3 л воды, нажимают кнопку включения.
Доводят рис до готовности, вода в пароварке должна полностью выпариться (примерно 15 мин), рис должен быть полностью готов.
Затем рисоварку выключают, перемешивают рис не касаясь дна. Закрывают крышкой и оставляют рис ещё на 25 минут в выключенной рисоварке (допаривание).') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12269,'Круассан готовый',1297550,'перед выпеканием круассан дефростировать при комнатной температуре , примерно, 3-4 часа, чтобы он немного приподнялся.
отпечь круассан в конвектомате 155С - 20 минут до золотистой корочки, дать остыть и расфасовать в бопп, запаять.
в готовом виде 1 круассан = 120 гр.
Наклеить наклейку 58х58 мм по ссылке из файла https://docs.google.com/spreadsheets/d/1RikTq-NJ61KxwtveiDaFZkW75fNW4MhgxDge3seszCc/edit?gid=463712123#gid=463712123') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12274,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см / Фасовка 60 гр',1297547,'Пакет с ДХ Филе грудки куриное Су-вид для кафе / Кусок (180 гр) рассчитан на 3 порций по 60 гр. 
Кусок при расфасовке нарезать кубиком 1х1 см.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12277,'Томленая говядина / Фасовка',1297528,'Пакет с ДХ Томленая говядина (200 гр) рассчитан на 5 порции по 40 гр. Пакет вскрыть и распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12284,'Пастрома из курицы с пряностями и медом / Кубики 1х1 см',1297314,'Пакет с ДХ Пастрома из курицы маринованная с пряностями и медом (240 гр) рассчитан на 4 порции по 60 гр. 
Пакет вскрыть, цельное филе нарезать кубиком 1х1 см и распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12310,'Блинчики выпеченные (50 гр/шт)',1297549,'Выпекать на сковороде с подсолнечным маслом порционно заливая тесто по 62 гр. Выход готового полуфабриката - 50 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12310,'Блинчики выпеченные (50 гр/шт)',1299394,'Выпекать на сковороде с подсолнечным маслом порционно заливая тесто по 62 гр. Выход готового полуфабриката - 50 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12313,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см / Фасовка 35 гр',1297549,'Пакет с ДХ Филе грудки куриное Су-вид для кафе / Кубик 1х1см (105 гр) рассчитан на 3 порции по 35 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12388,'Заправка для риса',1297548,'Все ингр-ты соединить и тщательно перемешать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12388,'Заправка для риса',1299208,'Все ингр-ты соединить и тщательно перемешать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12388,'Заправка для риса',1299287,'Все ингр-ты соединить и тщательно перемешать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12503,'Филе грудки куриное Су-вид  / Ломтик / Лимонный перец',1298177,'Пакет с ДХ Филе грудки куриное Су-вид / Кусок (165 гр) рассчитан на 1,5 порции по 110 гр. 
На кусок 165 гр - 1,5 гр лимонного перца.
Вскрыть пакет, филе грудки посыпать лимонным перцем, затем нарезать на ломтики 0.5-1 см.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12503,'Филе грудки куриное Су-вид  / Ломтик / Лимонный перец',1299211,'Пакет с ДХ Филе грудки куриное Су-вид / Кусок (165 гр) рассчитан на 1,5 порции по 110 гр. 
На кусок 165 гр - 1,5 гр лимонного перца.
Вскрыть пакет, филе грудки посыпать лимонным перцем, затем нарезать на ломтики 0.5-1 см.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12568,'Взбитый творожный крем с корицей',1298057,'половину белка замешиваем и пробиваем блендером , затем со спатулой замешиваем в крем вторую половинку взбитого белка  
Готовый крем перекладывают в конитерский мешок.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12569,'Банановый слой',1298057,'Готовить непосредственно перед сборкой десерта.
Банан без кожуры нарезают кубиком 0,2 см, слегка перемешивают, не применая, чтобы смесь стала немного вязкой.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12570,'Карамельный соус',1298057,'Готовую карамель ДХ открывают, используют нужное кол-во грамм, оставшуюся карамель хранят в холодильной камере на кухне для дальнейшего использования в этой заготовке
в течение 25 дней с даты вскрытия.
Карамель перемешивают с ряженкой, должен получится соус консистенции жирных сливок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12571,'Творожный крем с маскарпоне',1298058,'Перемешиваем спатулой (лопаткой) творожную смесь с белком. Готовый соус перекладывают в кондитерский мешок.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12571,'Творожный крем с маскарпоне',1299309,'Перемешиваем спатулой (лопаткой) творожную смесь с белком. Готовый соус перекладывают в кондитерский мешок.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12572,'Савоярди с кофе',1298058,'Печенье Савоярди поливаем с двух сторон кофейным соусом с помощью чайной ложки так, чтобы сердцевина печенья не промокла.
Затем ломаем печенье на 4 части (или разрезаем ножом).') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12573,'Брауни / Кубик 0,3 см',1298057,'Брауни от ДХ нужное количество гр, нарезаем кубиком 0,3-0,4 см.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12575,'Взбитый творожный крем с кремчизом',1298056,'Пробиваем блендером (ногой) творожную смесь с  половиной белка, затем вторую половину белка вмешиваем в крем спатулой. Перекладываем готовый крем в кондитерский мешок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12576,'Манго слой',1298056,'Разогревают воду (из кулера) на плите в сотейнике до температуры от 50С до 70С. 
В подготовленную воду постепенно высыпают пектин, постоянно помешивая, до желеобразного состояния пектина. 
В отдельном сотейнике прогревают на плите пюре манго до температуры 60-70 С, периодическом помешивая. 
"Желеобразный" подготовленный пектин добавляют в разогретое пюре манго, постоянно помешивая венчиком.
Доводят полуфабрикат до кипения, далее проваривают на "медленном" огне 1-2 мин.
Смесь должна быть однородной и загустеть.
Полуфабрикат остужают. Готовый соус перекладывают в кондитерский мешок.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12579,'Какао алкализованный Extra Brute / Фасовка',1298058,'Взвешивать порцию в 2 гр на ювелирных весах.
Готовый десерт посыпают какао с помощью сита.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12581,'Крошка безглютеновая для чизкейка',1298056,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12592,'Картофель беби запеченный с травами / Половинки',1298178,'Картофель свежий перебирают, тщательно промывают под холодной водой, разрезают пополам, заправляют маслом и специями: соль, перец, ветки тимьяна, листья шалфея.
Выкладывают на противень с пергаментом и запекают в конвектомате на 180 градусов - 15 минут, затем снижают температуру до 160 градусов - запекают еще 25 минут до готовности.
Далее полуфабрикат остужают, удаляют веточки тимьяна.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12592,'Картофель беби запеченный с травами / Половинки',1299247,'Картофель свежий перебирают, тщательно промывают под холодной водой, разрезают пополам, заправляют маслом и специями: соль, перец, ветки тимьяна, листья шалфея.
Выкладывают на противень с пергаментом и запекают в конвектомате на 180 градусов - 15 минут, затем снижают температуру до 160 градусов - запекают еще 25 минут до готовности.
Далее полуфабрикат остужают, удаляют веточки тимьяна.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12595,'Котлеты из тунца готовые',1298178,'ДХ Заготовка для котлет из тунца (120 гр) - в порции 2 котлеты, вскрыть упаковку, выложить на противень с пергаментом и выпекать в пароконвектомате 10 мин 
при температуре 180 С до готовности. 
Вес 1 готовой котлеты = 55 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12601,'Огурцы короткоплодные свежие / Соломка',1297548,'Огурцы обработанные нарезать тонкой соломкой.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12601,'Огурцы короткоплодные свежие / Соломка',1299287,'Огурцы обработанные нарезать тонкой соломкой.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12602,'Китайская (пекинская) капуста  / Нарезка',1297548,'Отрезаем от капусты жёсткую часть, мягкую режем треугольными недлинными полосками.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12607,'Обжаренная зеленая фасоль с перцем',1298178,'На разогретую с маслом сковороду выложить замороженную фасоль. Обжаривать на максимальном огне 2 минуты, периодически помешивая. 
Добавить специи, тщательно перемешать и обжаривать еще 3 минуты. Снять с огня и остудить. Контроль СОЛИ во вкусе!') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12607,'Обжаренная зеленая фасоль с перцем',1299247,'На разогретую с маслом сковороду выложить замороженную фасоль. Обжаривать на максимальном огне 2 минуты, периодически помешивая. 
Добавить специи, тщательно перемешать и обжаривать еще 3 минуты. Снять с огня и остудить. Контроль СОЛИ во вкусе!') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12620,'Свежая петрушка / Помыть',1295193,'Подготовленную петрушку тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12620,'Свежая петрушка / Помыть',1298405,'Подготовленную петрушку тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12620,'Свежая петрушка / Помыть',1299288,'Подготовленную петрушку тщательно промыть, обсушить.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12637,'Овощной бульон / Перетаривание',1297528,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12638,'Сок лимона (заправка) / Перетаривание',1297528,'перетаривание') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12639,'Горошек зеленый консервированный / Перетаривание',1297314,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). 
Банку вскрыть, содержимое откинуть на сито, дать хорошо стечь рассолу (маринаду)') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12639,'Горошек зеленый консервированный / Перетаривание',1297537,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). 
Банку вскрыть, содержимое откинуть на сито, дать хорошо стечь рассолу (маринаду)') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12640,'Морковь по-корейски с маринадом / Перетаривание',1297548,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). 
Упаковку вскрыть, слить маринад') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12640,'Морковь по-корейски с маринадом / Перетаривание',1298965,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). 
Упаковку вскрыть, слить маринад') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12640,'Морковь по-корейски с маринадом / Перетаривание',1298966,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). 
Упаковку вскрыть, слить маринад') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12641,'Острый чили соус Шрирача Aroy-D / Перетаривание',1297548,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). Упаковку вскрыть. Готовый соус накрыть крышкой или пленкой и проставить маркировку (наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). Хранить в холодильной камере.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12642,'Паста фузилли Pasteroni вареная',1298408,'Пасту сварить в кипящей!! подсоленной воде  в течение 6 мин 
до состояния "альденте",  воду слить, пасту откинуть на сито, 
промыть холодной кипяченой водой , дать хорошо стечь.   

Готовую вареную пасту заправить растительным  маслом и 
аккуратно перемешать.   
Готовую заправленную пасту распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12647,'Вареный зелёный булгур',1298418,'Булгур в сотейнике залить зелёным бульоном и кипятком в пропорции 1:1,5  крупы к жидкости варить на слабом огне на плите под крышкой 10 минут. Готовый вареный булгур откинуть на сито, дать хорошо стечь. НЕ промывать!

') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12650,'Котлеты из минтая готовые',1298405,'ДХ Заготовка для котлет из минтая (140 гр) - в порции 2 котлеты, вскрыть упаковку, выложить на противень с пергаментом и выпекать в пароконвектомате 15 мин 
при температуре 180 С до готовности. 
Вес 1 готовой котлеты = 52 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12687,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см / Фасовка',1298408,'Пакет с ДХ Филе грудки куриное Су-вид для кафе / Кубик 1х1см (360 гр) рассчитан на:
-  3 порции по 120 гр
- либо 6 порций по 60 гр') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12687,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см / Фасовка',1298839,'Пакет с ДХ Филе грудки куриное Су-вид для кафе / Кубик 1х1см (360 гр) рассчитан на:
-  3 порции по 120 гр
- либо 6 порций по 60 гр') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12700,'Водоросли нори для суши "Tidori" / Фасовка',1297548,'Целиком сложить в бопп (1 шт = 2,5 гр).
Фасовка 5 гр - для кафе 2 листа.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12700,'Водоросли нори для суши "Tidori" / Фасовка',1299287,'Целиком сложить в бопп (1 шт = 2,5 гр).
Фасовка 5 гр - для кафе 2 листа.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12701,'Запаренный кускус с мисо пастой',1298405,'Мисо пасту соединяем с кипятком, тщательно размешиваем до растворения.
Кус-кус соединить c солью, маслом, далее залить горячей водой (кипятком) с мисо, все перемешать, накрыть крышкой и оставить набухать.   ') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12701,'Запаренный кускус с мисо пастой',1299288,'Мисо пасту соединяем с кипятком, тщательно размешиваем до растворения.
Кус-кус соединить c солью, маслом, далее залить горячей водой (кипятком) с мисо, все перемешать, накрыть крышкой и оставить набухать.   ') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12702,'Запаренный кускус с пряностями',1295193,'Кускус смешивают со специями, заливают маслом и запаривают с горячей водой (кипятком), все перемешивают, накрывают крышкой и оставляют набухать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12738,'Грузинский куриный шашлычок / Фасовка',1298770,'Пакет с ДХ Грузинский куриный шашлычок (390 гр) рассчитан на 3 порции по 130 гр (2 шпажки по 65 гр в сыром виде). 
Мясо дефростируют в пакетк, затем пакет вскрывают и распределяют 3 куска мяса на шпажку по 65 гр, равномерно обжаривают на сковороде около 1 минуты до золотистой корочки.
ВАЖНО! Расстояние на сковороде между шашлыками не менее 2-3 см, чтобы они не тушились, а жарились!
 
Затем шашлычки выкладывают на противень (с пергаментом) и запекают в пароконвектомате при t- 180 град.С в течение 12 мин до готовности. 
Полуфабрикат остужают.
Выход 1 готовой порции: 2 шпажки по 50 гр.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12759,'Руккола (помыть)',1299250,'Рукколу перебрать от испорченных листьев, помыть, тщательно обсушить. не резать, распорционировать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12760,'Огурцы короткоплодные свежие / Кубик 1х1 см',1298835,'У подготовленных огурцов удалить плодоножки и непригодные к употреблению части, нарезать кубиком 1х1 см.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12761,'Слабосоленый лосось ломтики / Фасовка',1299250,'открыть пакет, использовать нужное кол-во') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12763,'Свекольный сок с водой',1298835,'Готовый сок смешать с водой (из кулера) в соотношении 1:2.
Свекольный сок с водой довести до кипения, снять с плиты, добавить соль и тщательно перемешать.
Далее остудить в камере шоковой заморозки.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12764,'Огурцы короткоплодные свежие / Ломтики',1298837,'У подготовленных огурцов удалить плодоножки и непригодные к употреблению части, нарезать вдоль пополам, каждую половинку нарезать на ломтики.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12765,'Перец красный / Ломтики',1298837,'У подготовленных перцев удалить плодоножку, внутренние перегородки и семенную коробочку, нарезать треугольными ломтиками среднего размера со сторонами 2-3 см.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12766,'Кабачок запеченный (ломтики)',1298770,'Обработанные кабачки нарезают вдоль волокон ломтиками на мандолине (длина 8 см, толщина 7 мм), посыпают солью, поливают маслом и перемешивают.
Затем выкладывают одним слоем в гастроемкость, запекают в конвектомате 9 минут при температуре 250 С до готовности.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12772,'Аджапсандал',1298752,'Все ингредиенты аккуратно соединить в гастроемкости, смешать до однородности, накрыть крышкой. Запечь в конвектомате при температуре 250°C на 5 минут.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12774,'Чевапчичи готовые / Фасовка',1298752,'Пакет с ДХ Заготовка для чевапчичи из курицы (420 гр) рассчитан на 3 порции по 140 гр в сыром виде. Пакет вскрыть.
ЗАМОРОЖЕННЫЕ чевапчичи выкладывают на противень (с пергаментом) и запекают в пароконвектомате при t- 180град. в течение 12 мин. 
Остужают и порционирую, закрывают плотно крышкой. Выход 1 готового полуфабриката = 120 гр. В порции 2 шт.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12776,'Пастрома из курицы маринованная для кафе / Кубик',1298865,'Пакет с ДХ Пастрома из курицы маринованная с пряностями и медом (180 гр) рассчитан на 2 порции по 40 гр. 
Пакет вскрыть, нарезать пастрому на кубики 1х1 см и распорционировать') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12777,'Бекон (нарезанный 1х1см) обжаренный',1298866,'Упаковку вскрыть, дефростированный бекон нарезать 1х1см, слегка обжарить') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12797,'Вареные яйца без скорлупы / Кубик',1298839,'Вареные яйца без скорлупы нарезать средним кубиком') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12800,'Салат романо / Кубик',1298838,'Мытый романо нарезать средним кубиком') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12800,'Салат романо / Кубик',1298839,'Мытый романо нарезать средним кубиком') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12801,'Зеленый лук / Измельчить',1298839,'Подготовленный зеленый лук нарезать квадратиком') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12812,'Сыр фета / На салат',1298837,'Фета нарезать прямоугольным куском толщиной не более 1,5 см и шириной 8 см.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12854,'Перец красный / Соломка 0,7 см',1298965,'У подготовленных перцев удалить плодоножку, внутренние перегородки и семенную коробочку, нарезать тонкой соломкой 0,7 см толщина, 6 см длина.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12854,'Перец красный / Соломка 0,7 см',1298966,'У подготовленных перцев удалить плодоножку, внутренние перегородки и семенную коробочку, нарезать тонкой соломкой 0,7 см толщина, 6 см длина.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12855,'Соус для шаурмы',1298965,'Подготовить ручной миксер Robot Coupe/венчик, кастрюлю подходящего объема. 
В кастрюлю добавить желтки, горчицу, взбить с помощью миксера/венчика в течение 3..5 минут до однородной консистенции и густой пены. 
Затем тонкой струйкой к желткам с горчицей влить подсолнечное масло, одновременно взбивая смесь миксером в течение 3..5 минут до однородной плотной консистенции. 
Далее в получившуюся яично-масляную смесь добавить шрирачу и кунджутный соус и тщательно перемешать с помощью миксера в течение 3 минут до однородной консистенции. Соус готов. 

Готовый соус накрыть крышкой или пленкой и проставить маркировку (наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Хранить в холодильной камере.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12855,'Соус для шаурмы',1298966,'Подготовить ручной миксер Robot Coupe/венчик, кастрюлю подходящего объема. 
В кастрюлю добавить желтки, горчицу, взбить с помощью миксера/венчика в течение 3..5 минут до однородной консистенции и густой пены. 
Затем тонкой струйкой к желткам с горчицей влить подсолнечное масло, одновременно взбивая смесь миксером в течение 3..5 минут до однородной плотной консистенции. 
Далее в получившуюся яично-масляную смесь добавить шрирачу и кунджутный соус и тщательно перемешать с помощью миксера в течение 3 минут до однородной консистенции. Соус готов. 

Готовый соус накрыть крышкой или пленкой и проставить маркировку (наименование, дата и время приготовления, дата и время окончания срока годности в формате ДД.ММ.ГГГГ). 
Хранить в холодильной камере.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12856,'Креветки жареные без хвостов',1298966,'У креветок УДАЛИТЬ ХВОСТЫ! Обсушить, они не должны быть мокрыми.
Предварительно разогреть электросковороду, на горячую электросковородку с 1 ст. ложкой подсолнечного масла выкладывают креветки 1 слоем, 
обжаривают на максимальном "огне" по 1-1,5 минуты с каждой стороны.
Креветки должны получиться непрозрачными, с красивым золотистым колером.
Далее готовые креветки солят и перчат, ВАЖНО контролировать количество специй на массе.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12857,'Салат романо / Соломка 0,5 см',1298966,'Мытый романо нарезать соломкой 0,5-0,7 см, должна быть короткой') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12859,'Рисовый пудинг для кафе',1293546,'Предварительно взбить миксером сливки, кремчиз и сахарную пудру. 
Рис "Жасмин" после вскрытия упаковки перебрать от не пригодных к употреблению частей, промыть, выложить в кастрюлю, залить горячей водой, 
добавить соль, все перемешать, варить 30 мин до испарения жидкости, затем добавить молоко и сахар и варить рис до консистенции "клейкой каши" 15-20 мин, 
далее кастрюлю снять с плиты, полуфабрикат измельчить блендером, остудить при комнатной температуре до теплого состояния риса. В рисовую массу, заливаем кипяток (воду из кулера) 
и еще раз пробить блендером до однородного состояния. В негорячую рисовую массу добавить кремчиз со сливками, тщательно перемешать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12859,'Рисовый пудинг для кафе',1297319,'Предварительно взбить миксером сливки, кремчиз и сахарную пудру. 
Рис "Жасмин" после вскрытия упаковки перебрать от не пригодных к употреблению частей, промыть, выложить в кастрюлю, залить горячей водой, 
добавить соль, все перемешать, варить 30 мин до испарения жидкости, затем добавить молоко и сахар и варить рис до консистенции "клейкой каши" 15-20 мин, 
далее кастрюлю снять с плиты, полуфабрикат измельчить блендером, остудить при комнатной температуре до теплого состояния риса. В рисовую массу, заливаем кипяток (воду из кулера) 
и еще раз пробить блендером до однородного состояния. В негорячую рисовую массу добавить кремчиз со сливками, тщательно перемешать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12859,'Рисовый пудинг для кафе',1299207,'Предварительно взбить миксером сливки, кремчиз и сахарную пудру. 
Рис "Жасмин" после вскрытия упаковки перебрать от не пригодных к употреблению частей, промыть, выложить в кастрюлю, залить горячей водой, 
добавить соль, все перемешать, варить 30 мин до испарения жидкости, затем добавить молоко и сахар и варить рис до консистенции "клейкой каши" 15-20 мин, 
далее кастрюлю снять с плиты, полуфабрикат измельчить блендером, остудить при комнатной температуре до теплого состояния риса. В рисовую массу, заливаем кипяток (воду из кулера) 
и еще раз пробить блендером до однородного состояния. В негорячую рисовую массу добавить кремчиз со сливками, тщательно перемешать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12864,'Лаваш тонкий круглый 84 гр/шт / Для кафе',1298965,'На порцию 84 гр: используем целый лист
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12864,'Лаваш тонкий круглый 84 гр/шт / Для кафе',1298966,'На порцию 84 гр: используем целый лист
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12868,'Оливки гриль Бондюэль / Перетаривание',1298837,'ВАЖНО! При вскрытии тары проводить визуальную оценку продукции на брак по инструкции, которая предоставлена в цехе (при необходимости уточнить у менеджера). Упаковку вскрыть, содержимое откинуть на сито, дать стечь маринаду.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12871,'Пастрома из курицы для фестиваля / Фасовка',1298965,'Пакет вскрыть и распорционировать.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12874,'Маринованные домашние огурцы / Соломка 0,7 см',1298965,'Огурцы нарезать соломкой  толщиной 0,7 см, длиной 4 см.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12891,'Напиток негазированный б/а со вкусом лесных ягод,  500 мл/бут х 12 шт ("Bursty" Водносоковая Компан)',1299080,NULL) ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12936,'Домашнее варенье из клюквы с пряностями',1299206,'1. Воду (из кулера) заливают в кастрюлю, туда же засыпают замороженную ягоду. Доводят до кипения на плите, далее и засыпают сахар. 
Аккуратно перемешивают воду до полного растворения сахара. 
Добавляют в кастрюлю фильтр-пакет со специями (бадьян, корицу, гвоздику, корень имбиря предварительно засыпать в фильтр-пакет д/чая), проваривают 3 минуты. Затем добавляют лимонный сок.
2. Варят полуфабрикат около 5 минут на "слабом огне" до готовности, периодически снимая пену.
3. Готовое варенье "снимают с огня", убирают мешочек. 
4. Фасовка: Разливают горячим в стерилизованные банки, закупоривают. Остужают в перевернутом виде.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12938,'Домашнее варенье из смородины с пряностями',1299207,'1.В отдельной емкости в горячей воде из кулера (80-90С) настаивают саган-дайля 15 минут. Процеживают.
2. Травяной настой "ставят на огонь", добавляют замороженную ягоду. 
Доводят до кипения и засыпают сахар. Аккуратно перемешивают жидкость до полного растворения сахара, 
после чего добавляют фильтр-пакет со специями (бадьян, корицу, гвоздику предварительно засыпать в фильтр-пакет д/чая). Через 3 минуты добавляют лимонный сок.
3. Полуфабрикат варят около 5 минут на "слабом огне" до готовности, снимая пену.
4. Готовое варенье "снимают с огня", убирают мешочек со специями. 
5. Фасовка: Варенье разливают горячим в стерилизованные банки, укутывают. Остужают в перевернутом виде .') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12942,'Бисквит протеиновый "Брауни Лимон-Чиа", коробка 10 шт х 50 гр (VTL labs, ООО" Рокет Фуд")',1299222,NULL) ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12943,'Бисквит протеиновый "Брауни Фисташка", коробка 10 шт х 50 гр (VTL labs, ООО" Рокет Фуд")',1299223,NULL) ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12944,'Бисквит протеиновый "Шоколадный брауни", коробка 10 шт х 50 гр (VTL labs, ООО" Рокет Фуд")',1299224,NULL) ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12957,'Подарок промо продукция кафе',1299263,NULL) ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12958,'ДХ Домашнее варенье из клюквы с пряностями (260 гр)',1299265,'Фасовка') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12966,'Слабосоленый лосось кубики / Фасовка',1298838,'Пакет вскрыть, ДХ Слабосоленый лосось филе без кожи без костей / Кубик 1х1 см (180 гр) рассчитан на:
- 4 порции по 45 гр
- 3 порции по 60 гр') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12966,'Слабосоленый лосось кубики / Фасовка',1299208,'Пакет вскрыть, ДХ Слабосоленый лосось филе без кожи без костей / Кубик 1х1 см (180 гр) рассчитан на:
- 4 порции по 45 гр
- 3 порции по 60 гр') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12966,'Слабосоленый лосось кубики / Фасовка',1299287,'Пакет вскрыть, ДХ Слабосоленый лосось филе без кожи без костей / Кубик 1х1 см (180 гр) рассчитан на:
- 4 порции по 45 гр
- 3 порции по 60 гр') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12967,'Бекон (ломтики) запеченный / Крошка',1298839,'Сырой бекон цельными ломтиками аккуратно укладывают в гастроемкость и запекают 7 минут при 230 °С. 
Готовый продукт подвергают обязательному охлаждению перед дальнейшей сборкой.
Измельчить в мелкую крошку с помощью ножа, придавить и порубить ножом если маленький объем / в чаше блендера если большой объем.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12969,'Вареная киноа в пароварке с соевым соусом и сахаром',1299209,'Варёную киноа соединяют с соевым соусом с сахаром. Тщательно перемешивают до равномерного распределения ингр-ов.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12970,'Домашний соус песто с кешью для капрезе с водой',1299209,'Воду из кулера вскипятить.
Домашний соус песто с кешью для капрезе добавляем кипяток. Хорошо перемешать.

') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12972,'Перепелиные яйца копченые / Пополам',1299247,'средний вес = 8-8,5 / шт
Разрезать пополам
На порцию 17 гр: 4 половинки') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12973,'Йогурт греческий с кремчизом и карри',1298839,'Все ингредиенты соединить и тщательно перемешать до равномерного распределения карри.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12974,'Скрэмбл для кафе',1299250,'Яичный меланж, яичный белок, куркуму и соль соединить и перемешать до однородной массы с помощью венчика. 
Разогреть сковороду на индукционной плите на мощности "7" (выше среднего) смазать растительным маслом. 
Влить подготовленную смесь и готовить при мощности "4" (ниже среднего) в течение 30 секунд, периодически аккуратно помешивая. 
Затем переключить на мощность "3" (слабая мощность) и готовить до готовности: в меру влажный, бледно-желтый, не допускать чрезмерного загустения. 
На последнем этапе добавить крем-чиз и интенсивно, но аккуратно перемешать до его полного расплавления. Готовое блюдо охладить до полного остывания в камере шоковой заморозки.
1 порция яичной массы в сыром виде = 130 гр.
За 1 раз можно приготовить на 1 сковороде не более 2х порций (т е 260 гр в сыром виде).') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12976,'Жареная свежая брокколи',1299209,'Брокколи бланшировать в кипящей воде в течение 30-40сек. Далее откинуть на сито, промыть холодной КИПЯЧЕННОЙ водой, дать хорошо стечь лишней жидкости.
Далее на разогретой сковороде с добавлением подсолнечного масла обжарить капусту брокколи в течение 1-2мин до светло-золотистого цвета до полуготовности, 
снять с плиты, дать постоять. Остудить. 

ПРИМЕЧАНИЕ:  
Готовая жареная капуста должна быть с сырцой!!!') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12978,'Креветки жареные для кафе / Фасовка',1299209,'Пакет с .ДХ Креветки жареные для кафе (320 гр) рассчитан на 4 порции по 80 гр. Пакет вскрыть и распорционировать.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12980,'Руккола (резаная)',1298838,'Рукколу перебрать от испорченных листьев, помыть, тщательно обсушить. порезать на 3-4 части') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(12993,'Тунец конфи ломтики для кафе',1299247,'Пакет вскрыть, куски готового тунца нарезать на ломтики вдоль волокон толщиной 0,3-0,5 см.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(13006,'Печенье-суфле протеиновое "Кокос", коробка 50 гр х 9 шт (ООО «Арсенал Атлета»)',1299324,NULL) ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(13007,'Батончик протеиновый "Кокос", коробка 50 г х 16 шт (ООО «Арсенал Атлета»)',1299325,NULL) ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(13008,'Жемчужный маринованный лук / Пополам',1299247,'Разрезать пополам
На порцию 7 гр: 3 половинки') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(13010,'Тортилья 25 см для кафе/ Целая',1298838,'Тортилью сложить пополам, расфасовать по бопп-пакетам.
Средний вес = 65 гр/шт.
Учтен % на перевес.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(13010,'Тортилья 25 см для кафе/ Целая',1298839,'Тортилью сложить пополам, расфасовать по бопп-пакетам.
Средний вес = 65 гр/шт.
Учтен % на перевес.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(13019,'Томленая говядина кубики в соусе / Фасовка',1299289,'Пакет с ДХ Томленая говядина в томатно-мясном соусе (160 гр) рассчитан на 1 порцию. Пакет вскрыть и распорционировать.') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(13020,'Паста Ризони вареная',1299289,'Пасту сварить в кипящей подсоленной воде  в течение 7 мин 
Затем откинуть на дуршлаг, дать жидкости стечь, добавить растительное масло и перемешать. Оставить до полного остывания') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;
INSERT INTO ready_food_wrappers(wrapper_id,wrapper_name,product_id,process_description) VALUES(13047,'Творожной начинка для блинчиков',1299394,'Соединить все ингредиенты и тщательно перемешать до однородной консистенции. Накрыть плёнкой или крышкой и охладить в холодильной камере в течение 5 минут.
') ON CONFLICT(wrapper_id,product_id) DO UPDATE SET process_description=EXCLUDED.process_description WHERE ready_food_wrappers.process_description IS NULL;

-- 374 эталонов (блюдо + ГЕ)
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(284,1293534,'КАФЕ Банана-кейк','блюдо','кейк','цвет','вкус','консист',1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(286,1299164,'КАФЕ Соевый соус (25 гр)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(287,1298408,'КАФЕ Паста Неаполетана с цыплёнком','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(288,1298409,'КАФЕ Лимонный мусс','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(289,1298838,'КАФЕ Ролл с лососем и сливочным сыром','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(290,1298839,'КАФЕ Супер-мега-белковый ролл с курицей карри и яйцом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(291,1299080,'КАФЕ Напиток Bursty б/а со вкусом лесных ягод, 12 шт х 500 мл/бут','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(292,1299161,'КАФЕ Малиновый соус (30 гр)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(293,1299162,'КАФЕ Сметана 15% (30 гр)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(294,1299163,'КАФЕ Томатный соус маринара (30 гр)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(295,1298177,'КАФЕ Нежная курица с запечёнными овощами','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(296,1299206,'КАФЕ Овсяная каша с клюквенным вареньем (200 гр)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(297,1299207,'КАФЕ Рисовый пудинг / с халвой и черной смородиной','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(298,1299209,'КАФЕ Боул с креветками и брокколи','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(299,1299222,'КАФЕ Бисквит протеиновый "Брауни Лимон-Чиа", 10 шт х 50 гр','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(300,1299223,'КАФЕ Бисквит протеиновый "Брауни Фисташка", 10 шт х 50 гр','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(301,1299224,'КАФЕ Бисквит протеиновый "Шоколадный брауни", 10 шт х 50 гр','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(302,1299247,'КАФЕ Салат Нисуаз с тунцом конфи','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(303,1299324,'КАФЕ Печенье-суфле протеиновое "Кокос", 50 гр х 9 шт','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(304,1297306,'КАФЕ Фрикадельки с брусничным соусом и гречкой','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(305,1294854,'КАФЕ Основа для "Зеленого смузи"','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(306,1294856,'КАФЕ Основа для смузи "Клубника-Банан"','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(307,1294926,'КАФЕ Чикен-стейк и гречка с ароматными травами','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(308,1295194,'КАФЕ Куриные кебабы с пряным булгуром','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(309,1295201,'КАФЕ Шашлычки Якитори с рисом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(310,1295222,'КАФЕ Сырники из натурального творога','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(311,1295825,'КАФЕ Основа для смузи "Тайское Манго"','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(312,1297305,'КАФЕ Курица Терияки с гречневой лапшой','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(313,1293548,'КАФЕ Шоколадная гранола из киноа с малиной и йогуртом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(314,1297320,'КАФЕ Том Кха с цыпленком','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(315,1297528,'КАФЕ Борщ с томлёной говядиной','блюдо',NULL,NULL,NULL,NULL,1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(316,1297547,'КАФЕ Куриный суп-лапша','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(317,1297548,'КАФЕ Японские хэнд-роллы в нори','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(318,1298056,'КАФЕ Кремовый чизкейк','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(319,1298057,'КАФЕ Взбитый творог «Баноффи» (банан, карамель, брауни)','блюдо',NULL,NULL,NULL,NULL,1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(320,1298058,'КАФЕ Творожный Тирамису','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(321,12969,'Вареная киноа в пароварке с соевым соусом и сахаром','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(322,12265,'Вареный рис Японика в пароварке','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(323,12568,'Взбитый творожный крем с корицей','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(324,12575,'Взбитый творожный крем с кремчизом','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(325,1176,'Лимонный мусс','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(326,12571,'Творожный крем с маскарпоне','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(327,4727,'Бланшированная фасоль зеленая стручковая с/м','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(328,12258,'Бланшированные бобы эдамаме','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(329,4190,'Вареная гречка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(330,4512,'Вареная гречневая лапша','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(331,11433,'Вареный булгур со специями','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(332,12970,'Домашний соус песто с кешью для капрезе с водой','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(333,12976,'Жареная свежая брокколи','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(334,1612,'Жареные шампиньоны','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(335,12246,'Зажарка из моркови с луком','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(336,12607,'Обжаренная зеленая фасоль с перцем','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(337,11430,'Овсяная каша готовая','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(338,12035,'Основа для супа том кха','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(339,12642,'Паста фузилли Pasteroni вареная','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(340,12859,'Рисовый пудинг для кафе','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(341,12967,'Бекон (ломтики) запеченный / Крошка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(342,3711,'Вареный птитим','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(343,11391,'Готовые сырники для кафе 50 гр/шт','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(344,12039,'Готовые фрикадельки из курицы / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(345,12037,'Запеченная курица филе со специями / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(346,5644,'Запеченная свекла / Бруски','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(347,12592,'Картофель беби запеченный с травами / Половинки','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(348,11437,'Кебабы из курицы / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(349,11440,'Куриный шашлычок в панировке из специй / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(350,9955,'Помидоры черри запеченные (целиком)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(351,12942,'Бисквит протеиновый "Брауни Лимон-Чиа", коробка 10 шт х 50 гр (VTL labs, ООО" Рокет Фуд")','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(352,12943,'Бисквит протеиновый "Брауни Фисташка", коробка 10 шт х 50 гр (VTL labs, ООО" Рокет Фуд")','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(353,12944,'Бисквит протеиновый "Шоколадный брауни", коробка 10 шт х 50 гр (VTL labs, ООО" Рокет Фуд")','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(354,12891,'Напиток негазированный б/а со вкусом лесных ягод,  500 мл/бут х 12 шт ("Bursty" Водносоковая Компан)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(355,13006,'Печенье-суфле протеиновое "Кокос", коробка 50 гр х 9 шт (ООО «Арсенал Атлета»)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(356,1299265,'Доп. Домашнее варенье из клюквы (260 гр)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(357,1296788,'Дублировать КАФЕ Салат Цезарь с курицей','блюдо',NULL,NULL,NULL,NULL,1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(358,1299325,'КАФЕ Батончик протеиновый "Кокос", 50 г х 16 шт','блюдо',NULL,NULL,NULL,NULL,1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(359,1293533,'КАФЕ Бефстроганов из томленой говядины','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(360,1297549,'КАФЕ Блинчики с начинкой Жюльен','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(361,1299394,'КАФЕ Блинчики с творожной начинкой (2 шт)','блюдо',NULL,NULL,NULL,NULL,1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(362,1299208,'КАФЕ Боул Филадельфия','блюдо',NULL,NULL,NULL,NULL,1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(363,1297874,'КАФЕ Брауни 1 шт х 70 г','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(364,1295379,'КАФЕ Брауни 4 шт х 70 г','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(365,1297537,'КАФЕ Винегрет','блюдо',NULL,NULL,NULL,NULL,1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(366,1293531,'КАФЕ Галета 4 сыра','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(367,1295007,'КАФЕ Галета 4 сыра Вер1','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(368,1298751,'КАФЕ Гаспачо','блюдо',NULL,NULL,NULL,NULL,1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(369,1298837,'КАФЕ Греческий салат','блюдо',NULL,NULL,NULL,NULL,1) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(370,1295193,'КАФЕ Запеченная индейка с кускусом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(371,1299288,'КАФЕ Запеченная индейка с чиа-кускусом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(372,1298407,'КАФЕ Зелёный птитим с курицей','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(373,1298836,'КАФЕ Зелёный салат с песто','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(374,1297308,'КАФЕ Индейка с корнеплодами','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(375,1295229,'КАФЕ Кабачковая вафля с сыром и тунцом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(376,1298405,'КАФЕ Котлеты из белой рыбы с кускусом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(377,1298178,'КАФЕ Котлеты из тунца с картофелем и зеленой фасолью','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(378,1297546,'КАФЕ Крем-суп из шампиньонов','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(379,1297550,'КАФЕ Круассан','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(380,1297875,'КАФЕ Кукис','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(381,1299211,'КАФЕ Курица су-вид с рисом и соусом из шпината','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(382,1297442,'КАФЕ Курица тандури с рисом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(383,1297307,'КАФЕ Лимонная курица с киноа','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(384,1297538,'КАФЕ Морковка по-корейски','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(385,1297545,'КАФЕ Морковный суп-пюре','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(386,1005000,'КАФЕ Овсяная каша с ягодным соусом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(387,1297318,'КАФЕ Овсяная каша с ягодным соусом (200 гр)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(388,1295466,'КАФЕ Овсяная каша с ягодным соусом (300 гр)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(389,1297314,'КАФЕ Оливье','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(390,1295153,'КАФЕ Омлет с итальянскими травами','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(391,1293547,'КАФЕ Омлет-ролл с кремчизом и красной рыбой','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(392,1299289,'КАФЕ Орзо с томленой говядиной','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(393,1294855,'КАФЕ Основа для смузи "Ананасовый Баунти"','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(394,1294857,'КАФЕ Основа для смузи "Облепиха"','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(395,1294858,'КАФЕ Основа для смузи "Черника-Смородина"','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(396,1293551,'КАФЕ Паста Болоньезе с бедром индейки','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(397,1298832,'КАФЕ Поке-боул с креветками','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(398,1294927,'КАФЕ Поке-боул с креветками и киноа','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(399,1293473,'КАФЕ Поке-боул с креветками и киноа (меньше огурца)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(400,1294931,'КАФЕ Поке-боул с креветками и киноа Вер2 (с апельсиновым соусом)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(401,1299309,'КАФЕ Проработка','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(402,1293550,'КАФЕ Протеин боул (яйца, фета, эдамаме, черрри)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(403,1297319,'КАФЕ Рисовый крем-пудинг (125 гр)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(404,1293546,'КАФЕ Рисовый пудинг с халвой и клубникой','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(405,1293573,'КАФЕ Салат Цезарь с курицей','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(406,1294929,'КАФЕ Салат Цезарь с пастрами из курицы','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(407,1298835,'КАФЕ Свекольник','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(408,1298865,'КАФЕ Седвич - ролл пастрами песто','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(409,1299250,'КАФЕ Скрэмбл с лососем','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(410,1293619,'КАФЕ Суп Том-ям с креветками и рисом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(411,1293625,'КАФЕ Тыквенный суп-пюре с кокосовым молоком','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(412,1297441,'КАФЕ Тяхан (Мисо рис с курицей)','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(413,1298965,'КАФЕ Фестиваль Шаурма','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(414,1298966,'КАФЕ Фестиваль Шримп ролл','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(415,1298418,'КАФЕ Фрикадельки с зелёным булгуром','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(416,1299287,'КАФЕ Хэнд-ролл Филадельфия в нори','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(417,1297503,'КАФЕ Цитрусовый чёрный лимонад','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(418,1297057,'КАФЕ Чай-лимонад с облепихой','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(419,1298752,'КАФЕ Чевапчичи и аджапсандал','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(420,1293621,'КАФЕ Чикен-стейк с гречкой','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(421,1298770,'КАФЕ Шашлык из курицы с овощами гриль','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(422,1293634,'КАФЕ Шоко-кукис','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(423,1295273,'КАФЕ Шоколадные кукис','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(424,1298866,'КАФЕ Яичный сендвич с ветчиной и сыром','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(425,1298406,'Кафе Котлеты из белой рыбы с картофелем горошком и редисом','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(426,1297485,'Кафе Черный лимонад','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(427,1299263,'ПРОМО. Подарок на открытие кафе Питер','блюдо',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(428,9960,'Авокадо-крем (больше авокадо)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(429,12772,'Аджапсандал','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(430,7866,'Азиатский соус микс: соевый соус + кунжутное масло + кукурузный сироп + рисовый уксус','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(431,11569,'Ананасовый Баунти / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(432,9238,'Апельсиновая паприка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(433,7261,'Апельсиновый соус для тунца','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(434,4530,'Базилик свежий зеленый (листья)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(435,5938,'Баклажан запеченный (ломтики)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(436,11275,'Банана-кейк','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(437,12569,'Банановый слой','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(438,13007,'Батончик протеиновый "Кокос", коробка 50 г х 16 шт (ООО «Арсенал Атлета»)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(439,12777,'Бекон (нарезанный 1х1см) обжаренный','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(440,6667,'Белокочанная капуста / Соломка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(441,9949,'Бланшированная кукуруза','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(442,12310,'Блинчики выпеченные (50 гр/шт)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(443,12573,'Брауни / Кубик 0,3 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(444,11543,'Брауни / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(445,1082,'Брусничный соус к мясу','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(446,10551,'Ванильное печенье в подарок УД / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(447,3796,'Вареная киноа','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(448,12797,'Вареные яйца без скорлупы / Кубик','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(449,9959,'Вареные яйца вкрутую без скорлупы','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(450,12647,'Вареный зелёный булгур','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(451,10154,'Взбитый кремчиз со сливками (без сахара) 3:1','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(452,12127,'Вкусовая добавка эликсира Уэнсдей с огурцом','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(453,12700,'Водоросли нори для суши "Tidori" / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(454,623,'Вяленые томаты / Мясорубка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(455,620,'Вяленые томаты / Половинки','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(456,9934,'Галета 4 сыра на песочном тесте','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(457,11295,'Галета 4 сыра на песочном тесте Вер1','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(458,1377,'Гаспачо','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(459,12639,'Горошек зеленый консервированный / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(460,12738,'Грузинский куриный шашлычок / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(461,4508,'ДЕГУСТАЦИЯ готовые шоколадные кукис','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(462,12958,'ДХ Домашнее варенье из клюквы с пряностями (260 гр)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(463,12136,'ДХ Основа для лимонада "Чёрный цитрус"  (1000 гр)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(464,8269,'Дайкон маринованный / Кубик 1х1 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(465,693,'Диетический малиновый соус (без желатина)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(466,12936,'Домашнее варенье из клюквы с пряностями','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(467,12938,'Домашнее варенье из смородины с пряностями','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(468,5879,'Домашний майонез "Провансаль Эрмитаж"','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(469,3103,'Домашний майонез с шрирача','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(470,9849,'Домашний соус Цезарь с анчоусами и пармезаном','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(471,4053,'Домашний соус песто с кешью для капрезе','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(472,13008,'Жемчужный маринованный лук / Пополам','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(473,11575,'Заатар зеленый по-палестински / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(474,12701,'Запаренный кускус с мисо пастой','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(475,12702,'Запаренный кускус с пряностями','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(476,11435,'Запеченная индейка филе с базиликом и тимьяном  / Слайсы','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(477,11431,'Запеченная кабачковая вафля','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(478,12042,'Запеченная курица филе с орегано и лимоном / Слайсы','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(479,4245,'Запеченная морковь / Бруски','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(480,6036,'Запеченная тыква от Ульяны Тихмяновой','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(481,11432,'Запеченные цуккини','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(482,9549,'Заправка "Соя Кабуль" от Люсьена Оливье','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(483,12388,'Заправка для риса','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(484,352,'Зеленый лук (не мыть)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(485,7409,'Зеленый лук (помыть)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(486,12801,'Зеленый лук / Измельчить','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(487,11568,'Зеленый смузи / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(488,1277,'Зеленый чатни с мятой, петрушкой и базиликом','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(489,12135,'Зелёный бульон','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(490,3101,'Икра летучей рыбы ОРАНЖЕВАЯ / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(491,11380,'Итальянская фриттата','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(492,9271,'Йогурт греческий без наполнителя 7%/ Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(493,12973,'Йогурт греческий с кремчизом и карри','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(494,12766,'Кабачок запеченный (ломтики)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(495,12579,'Какао алкализованный Extra Brute / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(496,4411,'Каперсы консервированные / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(497,12570,'Карамельный соус','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(498,3415,'Картофель Су-вид / кубик 1х1 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(499,5045,'Картофель бэби вареный половинки','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(500,11813,'Картофель запеченный / Кубик 2х2 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(501,12602,'Китайская (пекинская) капуста  / Нарезка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(502,7765,'Клубничный соус','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(503,8823,'Кокосовое молоко / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(504,12650,'Котлеты из минтая готовые','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(505,12595,'Котлеты из тунца готовые','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(506,213,'Красный лук (полукольца 0,2 см)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(507,9930,'Креветки Су-вид без хвостов для кафе','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(508,12856,'Креветки жареные без хвостов','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(509,12978,'Креветки жареные для кафе / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(510,12256,'Крем-суп из шампиньонов для кафе','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(511,417,'Кремчиз (сливочный сыр творожный) / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(512,12581,'Крошка безглютеновая для чизкейка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(513,12269,'Круассан готовый','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(514,12079,'Кунжутный микс специй: микс кунжута, лимонный перец, сушёный лук, имбирь, перец','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(515,8535,'Кунжутный терияки соус: соевый соус, кунжутное масло, мед, терияки','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(516,12864,'Лаваш тонкий круглый 84 гр/шт / Для кафе','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(517,11114,'Лимонная пастрома из курицы маринованная с пряностями / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(518,82,'Лимонный сок с цедрой','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(519,1649,'Лук с имбирем','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(520,12576,'Манго слой','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(521,3940,'Маринованная морковь','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(522,12874,'Маринованные домашние огурцы / Соломка 0,7 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(523,7677,'Маринованные корнишоны / Квадратики','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(524,9850,'Маринованные огурцы со свит чили','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(525,9851,'Маринованный редис в масле','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(526,4462,'Маслины каламата / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(527,4444,'Масло оливковое / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(528,7968,'Микрозелень гороха / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(529,9958,'Микс крошки: кунжутная халва, семена чиа','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(530,3875,'Микс кунжута 1:1','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(531,9932,'Микс орехов и специй: суш лук, семечки подсолнечника, миндаль, дукка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(532,402,'Мисо паста светлая / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(533,12254,'Морковный суп для кафе с кокосовым молоком','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(534,165,'Морковь мытая / Мелкая соломка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(535,8632,'Морковь очищенная Су-вид / Кубик 1х1 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(536,12640,'Морковь по-корейски с маринадом / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(537,11112,'Мясное рагу болоньезе с кусочками томатов / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(538,12637,'Овощной бульон / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(539,6285,'Огурцы короткоплодные 70-140 гр/шт','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(540,12760,'Огурцы короткоплодные свежие / Кубик 1х1 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(541,12764,'Огурцы короткоплодные свежие / Ломтики','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(542,12601,'Огурцы короткоплодные свежие / Соломка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(543,12868,'Оливки гриль Бондюэль / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(544,9926,'Омлет яичный на крахмале','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(545,448,'Орегано / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(546,9929,'Основа для супа Том-Ям','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(547,12257,'Основа для супа куриная лапша','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(548,9942,'Основа для тыквенного супа без кокосового молока','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(549,12641,'Острый чили соус Шрирача Aroy-D / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(550,5400,'П/Ф: Горошек жареный','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(551,13020,'Паста Ризони вареная','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(552,7695,'Паста из трав с чесноком (петрушка+масло+чеснок)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(553,11259,'Паста из трав с чесноком (петрушка+чеснок)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(554,9947,'Паста пенне Pasteroni вареная','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(555,12871,'Пастрома из курицы для фестиваля / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(556,12776,'Пастрома из курицы маринованная для кафе / Кубик','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(557,12284,'Пастрома из курицы с пряностями и медом / Кубики 1х1 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(558,11116,'Пастрома из курицы с пряностями и медом / Слайсы','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(559,12972,'Перепелиные яйца копченые / Пополам','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(560,12765,'Перец красный / Ломтики','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(561,12854,'Перец красный / Соломка 0,7 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(562,7397,'Перечный соус демиглас на основе бешамеля','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(563,252,'Петрушка свежая / Измельчить','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(564,12957,'Подарок промо продукция кафе','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(565,226,'Помидоры черри / Помыть','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(566,81,'Пшеничная мука не для теста / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(567,444,'Редис (не мыть)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(568,5074,'Редис мытый / Кубик 1х1 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(569,11140,'Риет из тунца (с творогом)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(570,10560,'Рис жасмин УД / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(571,2934,'Рис тайский вареный','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(572,8776,'Рис японика / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(573,4376,'Розмарин свежий (листья)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(574,140,'Руккола (не мыть)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(575,12759,'Руккола (помыть)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(576,12980,'Руккола (резаная)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(577,9330,'Рыбный фарш из минтая','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(578,12572,'Савоярди с кофе','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(579,12800,'Салат романо / Кубик','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(580,255,'Салат романо / Помыть','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(581,12857,'Салат романо / Соломка 0,5 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(582,5362,'Салат романо / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(583,9220,'Сахарный сироп с мятой','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(584,4449,'Свежая мята обработанная (листья)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(585,12620,'Свежая петрушка / Помыть','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(586,258,'Свежий тимьян (листья)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(587,241,'Свежий укроп (не мыть)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(588,8672,'Свекла очищенная Су-вид / Кубик 1х1 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(589,12763,'Свекольный сок с водой','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(590,354,'Свекольный сок свежевыжатый','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(591,5893,'Семена чиа / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(592,894,'Семечки тыквы очищенное / Фасовка (не жарить)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(593,12974,'Скрэмбл для кафе','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(594,11132,'Слабосоленый лосось кубик 1х1 см для сливочной начинки','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(595,12966,'Слабосоленый лосось кубики / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(596,12761,'Слабосоленый лосось ломтики / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(597,1998,'Сливки 22% / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(598,11131,'Сливочная начинка без лосося','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(599,1289,'Сметана 15% / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(600,11606,'Смузи "Тайское Манго" / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(601,11570,'Смузи Клубника-Банан / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(602,11571,'Смузи Облепиха / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(603,11572,'Смузи Черника-Смородина / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(604,4279,'Соевые бобы эдамаме / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(605,7548,'Соевые бобы эдамаме маринованные','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(606,8464,'Соевый соус (Pearl River Bridge) / Разбавленный','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(607,8446,'Соевый соус (Pearl River Bridge) / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(608,9388,'Соевый соус с мирином','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(609,12638,'Сок лимона (заправка) / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(610,187,'Сок лимона (заправка) / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(611,2870,'Сок лимона с орегано','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(612,1027,'Соленые огурцы / Кубик / 1,0х1,0см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(613,1977,'Соус винегрет','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(614,12855,'Соус для шаурмы','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(615,7960,'Соус манго-майо','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(616,819,'Соус мирин / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(617,9779,'Соус терияки / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(618,9514,'Специи: карри, имбирь, куркума','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(619,4106,'Специи: кориандр + карри','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(620,7437,'Специи: молотый имбирь + чеснок','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(621,2977,'Сухарики из чиабатты (кубик 1,0х1,0см)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(622,8342,'Сушеный микс грибов: шиитаке, муэр (7/10) / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(623,6081,'Сыр фета / Кубик 1х1 см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(624,12812,'Сыр фета / На салат','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(625,13047,'Творожной начинка для блинчиков','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(626,7707,'Тертый сыр пармезан (крошка) / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(627,12016,'Тимьян свежий / Перебрать','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(628,8442,'Томатный соус маринара','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(629,12277,'Томленая говядина / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(630,11118,'Томленая говядина в перечном соусе / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(631,13019,'Томленая говядина кубики в соусе / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(632,10401,'Тортилья 25 см УД / Целая','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(633,13010,'Тортилья 25 см для кафе/ Целая','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(634,8577,'Трюфельное масло / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(635,9741,'Тунец консервированный целое филе / Перетаривание','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(636,12993,'Тунец конфи ломтики для кафе','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(637,5434,'Укроп без стебля / Измельчить','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(638,12503,'Филе грудки куриное Су-вид  / Ломтик / Лимонный перец','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(639,9816,'Филе грудки куриное Су-вид / 126 в 120 гр / Кубик 2х2см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(640,9956,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(641,12687,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(642,12313,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см / Фасовка 35 гр','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(643,12047,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см / Фасовка 50 гр','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(644,12274,'Филе грудки куриное Су-вид для кафе / Кубик 1х1см / Фасовка 60 гр','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(645,7665,'Фурикакэ / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(646,9995,'Цитрусовая соль: розовая соль, лимонный перец, цедра апельсина, базилик','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(647,4571,'Цыпленок тандури томленый','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(648,11799,'Чай синий цветочный Анчан','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(649,11949,'Чай-лимонад с облепихой / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(650,12774,'Чевапчичи готовые / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(651,5350,'Чесночный соус с тимьяном','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(652,9962,'Шоко-кукис на сиропе топинамбура','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(653,9961,'Шоколадная гранола','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(654,11016,'Шпинат листовой с/м / Не размораживать','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(655,625,'Шпинат свежий / Помыть','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(656,1956,'Ягодный компот (соус)','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(657,7983,'Яичный желток "Удобное яйцо" / Фасовка','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;
INSERT INTO quality_standards(id,item_id,name,company,appearance,color,taste_smell,consistency,always_check) VALUES(658,8049,'Яичный скрамбл','ГЕ',NULL,NULL,NULL,NULL,0) ON CONFLICT DO NOTHING;

COMMIT;