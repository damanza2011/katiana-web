# -*- coding: utf-8 -*-
"""
Generador del Documento Maestro en Word (.docx)
KATIANA DROGUERÍA ONLINE · GUÍA MAESTRA LEGAL, LOGÍSTICA, MARKETING Y FINANZAS
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    """Aplica color de fondo a una celda de tabla."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    """Establece márgenes internos de una celda."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    # Configuración de márgenes de página (2.2 cm)
    for section in doc.sections:
        section.top_margin = Inches(0.85)
        section.bottom_margin = Inches(0.85)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)

    # Colores corporativos KATIANA
    COLOR_PRIMARY = RGBColor(5, 150, 105)     # #059669 Esmeralda
    COLOR_PRIMARY_DARK = RGBColor(6, 78, 59) # #064E3B Esmeralda Oscuro
    COLOR_SECONDARY = RGBColor(2, 132, 199)  # #0284C7 Azul Farmacéutico
    COLOR_DARK = RGBColor(15, 23, 42)        # #0F172A Pizarra Oscuro
    COLOR_MUTED = RGBColor(100, 116, 139)    # #64748B Gris Texto
    HEX_PRIMARY = "059669"
    HEX_LIGHT_BG = "F0FDF4"
    HEX_MUTED_BG = "F8FAFC"
    HEX_BORDER = "E2E8F0"

    # Estilo base
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Calibri'
    style_normal.font.size = Pt(11)
    style_normal.font.color.rgb = COLOR_DARK

    # ==========================================
    # 1. PORTADA ELEGANTE
    # ==========================================
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(40)
    p_pre.paragraph_format.space_after = Pt(8)
    run_pre = p_pre.add_run("PLAN MAESTRO ESTRATÉGICO · COLOMBIA 2026")
    run_pre.font.size = Pt(10)
    run_pre.font.bold = True
    run_pre.font.color.rgb = COLOR_SECONDARY
    p_pre.alignment = WD_ALIGN_PARAGRAPH.CENTER

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_after = Pt(12)
    run_title = p_title.add_run("KATIANA DROGUERÍA ONLINE")
    run_title.font.size = Pt(28)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_PRIMARY_DARK
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(24)
    run_sub = p_sub.add_run("Manual de Despliegue Legal de 'Dark Pharmacy' (Farmacia Oculta),\nLogística de Última Milla con Agregadores, Marketing Digital y Finanzas Internacionales")
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = COLOR_DARK
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # Caja decorativa de metadatos de autoría
    table_meta = doc.add_table(rows=1, cols=1)
    table_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table_meta.rows[0].cells[0]
    set_cell_background(cell, HEX_LIGHT_BG)
    set_cell_margins(cell, top=200, bottom=200, left=300, right=300)
    
    p_meta = cell.paragraphs[0]
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_meta.paragraph_format.space_after = Pt(4)
    r1 = p_meta.add_run("COMITÉ ESTRATÉGICO MULTIDISCIPLINARIO:\n")
    r1.font.bold = True
    r1.font.size = Pt(10)
    r1.font.color.rgb = COLOR_PRIMARY_DARK
    
    r2 = p_meta.add_run("• Asesoría Legal y Sanitaria Farmacéutica (INVIMA y Secretarías de Salud)\n• Dirección de Operaciones & Logística de Dark Stores\n• Vicepresidencia de Marketing Digital & Growth Farmacéutico\n• Dirección de Finanzas Internacionales & Cadena de Suministro")
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = COLOR_DARK

    doc.add_page_break()

    # ==========================================
    # 2. ÍNDICE Y RESUMEN EJECUTIVO
    # ==========================================
    h1 = doc.add_heading("1. RESUMEN EJECUTIVO Y MODELO DE NEGOCIO", level=1)
    h1.style.font.color.rgb = COLOR_PRIMARY_DARK
    h1.style.font.size = Pt(16)

    p = doc.add_paragraph()
    p.add_run(
        "El proyecto KATIANA representa la evolución del comercio farmacéutico en Colombia hacia el modelo de "
    )
    r = p.add_run("Dark Pharmacy (Farmacia Oculta o Micro-Hub Satélite de Dispensación)")
    r.bold = True
    p.add_run(
        ", un formato de alta rentabilidad que elimina los elevados costos de arrendamiento comercial en vías principales y optimiza cada metro cuadrado exclusivamente para la recepción técnica, almacenamiento climatizado, picking de alta velocidad y despacho express en menos de 45 minutos."
    )

    p2 = doc.add_paragraph()
    p2.add_run(
        "A diferencia de una cocina oculta gastronómica tradicional, los medicamentos y dispositivos médicos están amparados por un "
    )
    r_alerta = p2.add_run("marco regulatorio sanitario de orden público")
    r_alerta.bold = True
    p2.add_run(
        ". En Colombia no existe un vacío legal: la venta de medicamentos a distancia está formalmente permitida, siempre que el establecimiento cumpla con todos los estándares locativos y cuente con la Dirección Técnica obligatoria de un Regente de Farmacia calificado ante la Secretaría de Salud y el INVIMA."
    )

    # ==========================================
    # 3. MARCO LEGAL Y REGULATORIO EXHAUSTIVO
    # ==========================================
    doc.add_page_break()
    h2 = doc.add_heading("2. MARCO LEGAL Y REQUISITOS SANITARIOS EN COLOMBIA", level=1)
    h2.style.font.color.rgb = COLOR_PRIMARY_DARK
    h2.style.font.size = Pt(16)

    p = doc.add_paragraph()
    p.add_run("Para desplegar legalmente la Dark Pharmacy de KATIANA, se debe cumplir con el bloque de constitucionalidad y normatividad sanitaria colombiana:")

    normas = [
        ("Decreto 780 de 2016 (Decreto Único Reglamentario del Sector Salud)", "Regula la gestión integral del servicio farmacéutico minorista (droguerías), condiciones de habilitación, dispensación y modalidades de entrega."),
        ("Resolución 1403 de 2007 (Ministerio de la Protección Social)", "Determina el Manual de Condiciones Esenciales y Procedimientos del Servicio Farmacéutico, incluyendo almacenamiento (BPA) y transporte a domicilio."),
        ("Resolución 3100 de 2019", "Establece las condiciones y requisitos de habilitación para prestadores de servicios de salud y dispensación asociada."),
        ("Ley 1581 de 2012 y Decreto 1377 de 2013 (Habeas Data)", "Protección de datos personales sensibles de salud (fórmulas médicas, historiales de compra y cédulas de pacientes)."),
        ("Decreto 677 de 1995 y Decreto 824 de 2001", "Régimen de control y vigilancia sanitaria del INVIMA sobre publicidad, registro y venta de medicamentos.")
    ]

    for title, desc in normas:
        p_item = doc.add_paragraph(style='List Bullet')
        r_t = p_item.add_run(f"{title}: ")
        r_t.bold = True
        r_t.font.color.rgb = COLOR_PRIMARY
        p_item.add_run(desc)

    # Subsección Requisitos Locativos
    h_loc = doc.add_heading("2.1. Requisitos Locativos de la Bodega / Farmacia Oculta", level=2)
    h_loc.style.font.color.rgb = COLOR_SECONDARY
    h_loc.style.font.size = Pt(13)

    p_loc = doc.add_paragraph()
    p_loc.add_run("La bodega o local donde operará la Dark Pharmacy no requiere vitrina de cara al público peatonal, pero debe superar de manera obligatoria la visita de inspección de la ")
    p_loc.add_run("Secretaría Distrital/Departamental de Salud").bold = True
    p_loc.add_run(" para obtener el Concepto Sanitario Favorable. Debe contar con las siguientes 6 zonas independientes debidamente demarcadas:")

    table_zonas = doc.add_table(rows=7, cols=2)
    table_zonas.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Área Técnica Obligatoria", "Especificaciones y Equipamiento Sanitario"]
    
    # Encabezados
    for i, h_text in enumerate(headers):
        cell = table_zonas.rows[0].cells[i]
        set_cell_background(cell, HEX_PRIMARY)
        set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
        p_cell = cell.paragraphs[0]
        r = p_cell.add_run(h_text)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(10)

    zonas_data = [
        ("1. Área de Recepción Técnica y Administrativa", "Mesa de inspección lavable, computador con software de inventario, verificación de empaques, fecha de vencimiento y registro INVIMA contra factura del proveedor."),
        ("2. Área de Almacenamiento General", "Estanterías metálicas esmaltadas o inoxidables lavables. Estibas plásticas no porosas a mínimo 15 cm del suelo. Termohigrómetro digital calibrado (<30°C y <67% Humedad Relativa)."),
        ("3. Área Especial de Cadena de Frío", "Nevera exclusiva para medicamentos termolábiles (2°C a 8°C) con termómetro de máxima y mínima, plan de contingencia ante cortes de luz y registro bidiario (mañana y tarde)."),
        ("4. Área de Cuarentena / Rechazados", "Zona delimitada en color amarillo/rojo, con llave o acceso restringido, para medicamentos con fecha de vencimiento próxima, averías o devoluciones."),
        ("5. Área de Picking, Packing y Despacho", "Mesa ergonómica de alistamiento rápido, selladoras térmicas, bolsas de seguridad inviolables con precinto numerado y zona de entrega directa para domiciliarios."),
        ("6. Área Sanitaria y Residuos (PGIRHS)", "Baño higiénico independiente alejado del inventario farmacéutico. Contenedores de residuos señalizados (código de colores) y caneca roja para biológicos/medicamentos vencidos contratada con empresa certificada.")
    ]

    for row_idx, (z_title, z_desc) in enumerate(zonas_data, start=1):
        row = table_zonas.rows[row_idx]
        # Columna 1
        c0 = row.cells[0]
        set_cell_background(c0, HEX_LIGHT_BG if row_idx % 2 == 1 else "FFFFFF")
        set_cell_margins(c0, top=100, bottom=100, left=150, right=150)
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(z_title)
        r0.bold = True
        r0.font.size = Pt(9.5)
        
        # Columna 2
        c1 = row.cells[1]
        set_cell_background(c1, HEX_LIGHT_BG if row_idx % 2 == 1 else "FFFFFF")
        set_cell_margins(c1, top=100, bottom=100, left=150, right=150)
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(z_desc)
        r1.font.size = Pt(9)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Subsección Dirección Técnica
    h_dir = doc.add_heading("2.2. Dirección Técnica y Talento Humano Obligatorio", level=2)
    h_dir.style.font.color.rgb = COLOR_SECONDARY
    h_dir.style.font.size = Pt(13)

    p_dir = doc.add_paragraph()
    p_dir.add_run(
        "Por ley (Ley 485 de 1998 y Decreto 780 de 2016), una droguería no puede funcionar sin la presencia activa de un "
    )
    p_dir.add_run("Tecnólogo en Regencia de Farmacia").bold = True
    p_dir.add_run(
        " o Químico Farmacéutico con inscripción en el Registro Único Nacional del Talento Humano en Salud ("
    )
    p_dir.add_run("ReTHUS").bold = True
    p_dir.add_run(
        "). Este profesional es el custodio legal del inventario, responsable de validar las fórmulas médicas, custodiar la cadena de frío y responder ante visitas del INVIMA."
    )

    # ==========================================
    # 4. LOGÍSTICA DE DARK PHARMACY Y AGREGADORES
    # ==========================================
    doc.add_page_break()
    h3 = doc.add_heading("3. LOGÍSTICA DE 'DARK PHARMACY' Y RED DE AGREGADORES", level=1)
    h3.style.font.color.rgb = COLOR_PRIMARY_DARK
    h3.style.font.size = Pt(16)

    p = doc.add_paragraph()
    p.add_run(
        "El éxito de una droguería oculta radica en su velocidad de alistamiento ("
    )
    p.add_run("Pick & Pack < 5 minutos").bold = True
    p.add_run(
        ") y en una orquestación omnicanal de mensajería que minimice los costos de comisión de las plataformas."
    )

    h_agg = doc.add_heading("3.1. Comparativa de Plataformas y Canales de Recogida", level=2)
    h_agg.style.font.color.rgb = COLOR_SECONDARY
    h_agg.style.font.size = Pt(13)

    table_log = doc.add_table(rows=5, cols=4)
    table_log.alignment = WD_TABLE_ALIGNMENT.CENTER
    log_headers = ["Canal / Agregador", "Modelo Operativo", "Estructura de Comisión", "Rol Estratégico en KATIANA"]
    
    for i, h_text in enumerate(log_headers):
        cell = table_log.rows[0].cells[i]
        set_cell_background(cell, "0284C7")
        set_cell_margins(cell, top=140, bottom=140, left=140, right=140)
        p_cell = cell.paragraphs[0]
        r = p_cell.add_run(h_text)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9.5)

    log_data = [
        ("Rappi Farmacias", "Catálogo integrado en app de Rappi. Domiciliario recoge en la Dark Store.", "18% - 24% por pedido vendido", "Canal de adquisición masiva de clientes nuevos y pedidos de urgencia 24/7."),
        ("Mensajeros Urbanos (B2B)", "Despacho dedicado para pedidos generados en katiana-web.", "Tarifa fija por trayecto ($6.500 - $8.500 COP)", "Despachos propios sin perder margen de venta porcentual. Alta rentabilidad."),
        ("Picap / Boyacá Envíos", "Red rápida motorizada para entregas express inmediatas.", "Tarifa por km dinámico (~$7.000 COP)", "Respaldo y sobreflujo en horas pico de alta congestión urbana."),
        ("Flota Híbrida Propia (2 motos)", "Domiciliarios contratados con dotación KATIANA y datáfono móvil.", "Salario fijo + rodamiento ($1.8M COP/mes)", "Control de la experiencia, garantía de cadena de frío y cobro con datáfono.")
    ]

    for row_idx, data_row in enumerate(log_data, start=1):
        row = table_log.rows[row_idx]
        for col_idx, text_val in enumerate(data_row):
            c = row.cells[col_idx]
            set_cell_background(c, HEX_MUTED_BG if row_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(c, top=90, bottom=90, left=120, right=120)
            p_c = c.paragraphs[0]
            r = p_c.add_run(text_val)
            if col_idx == 0:
                r.bold = True
            r.font.size = Pt(8.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    h_pack = doc.add_heading("3.2. Protocolo de Cadena de Frío y Empaque Inviolable", level=2)
    h_pack.style.font.color.rgb = COLOR_SECONDARY
    h_pack.style.font.size = Pt(13)

    p_pack = doc.add_paragraph()
    p_pack.add_run(
        "Por mandato de la Resolución 1403 de 2007, ningún medicamento puede ser entregado abierto o vulnerable a contaminación durante el transporte. KATIANA implementa:\n"
    )
    p_pack.add_run("1. Bolsas con cinta de seguridad 'Void' inviolable: ").bold = True
    p_pack.add_run("Si el domiciliario intenta abrir el paquete antes de entregarlo al cliente, el sello se fractura visiblemente.\n")
    p_pack.add_run("2. Termos herméticos de transporte para biológicos: ").bold = True
    p_pack.add_run("Equipados con geles refrigerantes en placa eutéctica y datalogger térmico para insulinas, colirios y vacunas.\n")
    p_pack.add_run("3. Ficha de entrega con código QR de verificación: ").bold = True
    p_pack.add_run("Permite al cliente final consultar el registro INVIMA y fecha de vencimiento de cada ítem antes de recibir.")

    # ==========================================
    # 5. ESTRATEGIA DE MARKETING DIGITAL FARMACÉUTICO
    # ==========================================
    doc.add_page_break()
    h4 = doc.add_heading("4. ESTRATEGIA DE MARKETING DIGITAL & GROWTH FARMACÉUTICO", level=1)
    h4.style.font.color.rgb = COLOR_PRIMARY_DARK
    h4.style.font.size = Pt(16)

    p = doc.add_paragraph()
    p.add_run(
        "El marketing de salud y farmacia se rige por normas éticas y sanitarias estrictas. A continuación, la estrategia diseñada por nuestra experta en Growth & Performance Farmacéutico:"
    )

    h_reg = doc.add_heading("4.1. Lo que SÍ y lo que NO se puede publicitar (Compliance INVIMA)", level=2)
    h_reg.style.font.color.rgb = COLOR_SECONDARY
    h_reg.style.font.size = Pt(13)

    p_reg = doc.add_paragraph()
    p_reg.add_run("• PROHIBIDO POR LEY (Art. 79 Decreto 677/1995): ").bold = True
    p_reg.add_run("Pautar o hacer anuncios de medicamentos bajo fórmula médica (antibióticos, hipertensivos, ansiolíticos). Prometer curas mágicas o usar testimonios engañosos.\n")
    p_reg.add_run("• PERMITIDO Y ALTAMENTE RENTABLE: ").bold = True
    p_reg.add_run("Publicitar medicamentos de venta libre (OTC) con leyenda obligatoria ('Es un medicamento, no exceder su consumo...'), toda la línea de dermocosmética clínica, nutrición deportiva, maternidad y la promesa de servicio express de 45 minutos.")

    h_funnel = doc.add_heading("4.2. Motor de Adquisición Digital y Performance", level=2)
    h_funnel.style.font.color.rgb = COLOR_SECONDARY
    h_funnel.style.font.size = Pt(13)

    funnel_items = [
        ("Google Search Ads de Alta Intención Local", "Campañas en red de búsqueda para términos inmediatos de necesidad ('drogueria a domicilio chicó', 'farmacia 24 horas bogota norte', 'comprar anthelios uv mune express'). Tasa de conversión típica: 8% a 14%."),
        ("Meta Ads (Instagram & TikTok) para Dermocosmética", "Campañas visuales de rutinas de cuidado facial (CeraVe, La Roche-Posay, Cicaplast). Vídeos cortos estilo UGC (User Generated Content) con dermatólogos explicando el uso correcto."),
        ("WhatsApp Marketing Automatizado & Retención de Crónicos", "Los pacientes crónicos (presión, tiroides, vitaminas, anticonceptivos) recompran cada 28-30 días. Mediante el CRM de Katiana, enviamos recordatorios 3 días antes del agotamiento. Incrementa el LTV en más del 250%."),
        ("SEO Clínico y de Síntomas", "Artículos de blog y vademécum interactivo optimizado para búsquedas orgánicas sobre alivio de cefaleas, cuidado del bebé y prevención de quemaduras solares.")
    ]

    for title, detail in funnel_items:
        p_f = doc.add_paragraph(style='List Bullet')
        r_f = p_f.add_run(f"{title}: ")
        r_f.bold = True
        r_f.font.color.rgb = COLOR_PRIMARY
        p_f.add_run(detail)

    # ==========================================
    # 6. ESTRATEGIA FINANCIERA INTERNACIONAL Y PROVEEDORES
    # ==========================================
    doc.add_page_break()
    h5 = doc.add_heading("5. FINANZAS INTERNACIONALES Y NEGOCIACIÓN CON PROVEEDORES", level=1)
    h5.style.font.color.rgb = COLOR_PRIMARY_DARK
    h5.style.font.size = Pt(16)

    p = doc.add_paragraph()
    p.add_run(
        "Nuestra experta en finanzas internacionales enfoca la estructura económica de KATIANA en dos pilares: la optimización del "
    )
    p.add_run("Ciclo de Conversión de Efectivo (Capital de Trabajo Negativo)").bold = True
    p.add_run(
        " y la mitigación del riesgo cambiario en productos importados."
    )

    h_ccc = doc.add_heading("5.1. La Regla de Oro: Ciclo de Conversión de Efectivo Negativo (CCC < 0)", level=2)
    h_ccc.style.font.color.rgb = COLOR_SECONDARY
    h_ccc.style.font.size = Pt(13)

    p_ccc = doc.add_paragraph()
    p_ccc.add_run(
        "En el comercio farmacéutico moderno, el crecimiento acelerado no se financia con deuda bancaria costosa, sino con el apalancamiento operativo con proveedores:\n"
    )
    p_ccc.add_run("• Días de Cobro (DSO): 0 Días. ").bold = True
    p_ccc.add_run("El cliente final paga de contado, contra entrega o por pasarela electrónica en el segundo cero.\n")
    p_ccc.add_run("• Días de Inventario (DIO): 15 a 18 Días. ").bold = True
    p_ccc.add_run("Gestión Just-in-Time mediante algoritmo ABC que predice la demanda y evita acumulación de stock ocioso.\n")
    p_ccc.add_run("• Días de Pago a Proveedores (DPO): 45 a 60 Días. ").bold = True
    p_ccc.add_run("Negociados con distribuidores mayoristas (Copidrogas, Axon, Drosan).\n")
    p_ccc.add_run("→ Resultado Financiero: ").bold = True
    p_ccc.add_run("KATIANA dispone del dinero de las ventas durante más de 30 días antes de tener que pagárselo al proveedor, generando un flujo de caja libre positivo permanente para reinvertir en marketing y expansión.")

    h_prov = doc.add_heading("5.2. Mapa Estratégico de Proveedores en Colombia", level=2)
    h_prov.style.font.color.rgb = COLOR_SECONDARY
    h_prov.style.font.size = Pt(13)

    table_prov = doc.add_table(rows=5, cols=3)
    table_prov.alignment = WD_TABLE_ALIGNMENT.CENTER
    prov_headers = ["Tipo de Proveedor", "Empresas Clave en Colombia", "Condición Comercial & Margen Típico"]
    
    for i, h_text in enumerate(prov_headers):
        cell = table_prov.rows[0].cells[i]
        set_cell_background(cell, HEX_PRIMARY)
        set_cell_margins(cell, top=140, bottom=140, left=140, right=140)
        p_cell = cell.paragraphs[0]
        r = p_cell.add_run(h_text)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9.5)

    prov_data = [
        ("Cooperativa Mayorista", "Copidrogas (Cooperativa Nacional de Droguistas)", "Crédito a 30-45 días. Despacho diario sin pedido mínimo alto. Margen bruto: 20% - 28%."),
        ("Distribuidores Mayoristas Privados", "Axon Pharma, Droguerías Drosan, Éticos Serrano", "Especialidad en marcas comerciales, dermocosmética y OTC de alta rotación. Descuentos por pronto pago (2%-3%)."),
        ("Laboratorios Directos (Fabricantes)", "Tecnoquímicas (MK), Sanofi, Genfar, Abbott, Bayer", "Requieren volumen de compra mensual superior a $25M COP. Margen bruto máximo: 40% a 55% en genéricos."),
        ("Multinacionales de Dermocosmética", "L'Oréal Dermatological Beauty (CeraVe, La Roche-Posay)", "Línea importada cotizada con lista de precios trimestral. Margen bruto: 28% - 35%. Material de marketing POP digital.")
    ]

    for row_idx, data_row in enumerate(prov_data, start=1):
        row = table_prov.rows[row_idx]
        for col_idx, text_val in enumerate(data_row):
            c = row.cells[col_idx]
            set_cell_background(c, HEX_LIGHT_BG if row_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(c, top=90, bottom=90, left=120, right=120)
            p_c = c.paragraphs[0]
            r = p_c.add_run(text_val)
            if col_idx == 0:
                r.bold = True
            r.font.size = Pt(8.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    h_fx = doc.add_heading("5.3. Cobertura Cambiaria (Hedging) para Insumos y Dermocosmética", level=2)
    h_fx.style.font.color.rgb = COLOR_SECONDARY
    h_fx.style.font.size = Pt(13)

    p_fx = doc.add_paragraph()
    p_fx.add_run(
        "Gran parte de la dermocosmética (La Roche-Posay, CeraVe) y de los dispositivos médicos (Omron, glucómetros) tienen componentes importados o se rigen por listas de precios atadas al dólar (USD). Cuando la tasa de cambio COP/USD se devalúa, los mayoristas aplican reajustes inmediatos. KATIANA mitiga este riesgo mediante:\n"
    )
    p_fx.add_run("1. Contratos de suministro con precio congelado: ").bold = True
    p_fx.add_run("Negociación de compras trimestrales anticipadas en referencias de alta rotación (anthelios, cremas hidratantes).\n")
    p_fx.add_run("2. Cobertura en mezcla de catálogo: ").bold = True
    p_fx.add_run("Contrapesar líneas importadas (margen 30%) con líneas genéricas bioequivalentes nacionales de alta rentabilidad (margen 60%), asegurando un margen bruto consolidado superior al 38%.\n")
    p_fx.add_run("3. Cláusula de reposición dinámica de inventario: ").bold = True
    p_fx.add_run("Ajuste automatizado en el e-commerce de precios minoristas cuando el distribuidor actualiza su lista mayorista.")

    # ==========================================
    # 7. CRONOGRAMA DE IMPLEMENTACIÓN EN 60 DÍAS
    # ==========================================
    doc.add_page_break()
    h6 = doc.add_heading("6. HOJA DE RUTA Y CRONOGRAMA DE DESPLIEGUE (60 DÍAS)", level=1)
    h6.style.font.color.rgb = COLOR_PRIMARY_DARK
    h6.style.font.size = Pt(16)

    table_crono = doc.add_table(rows=5, cols=3)
    table_crono.alignment = WD_TABLE_ALIGNMENT.CENTER
    crono_headers = ["Fase y Semanas", "Hitos Operativos y Legales", "Entregables Tangibles"]
    
    for i, h_text in enumerate(crono_headers):
        cell = table_crono.rows[0].cells[i]
        set_cell_background(cell, "064E3B")
        set_cell_margins(cell, top=140, bottom=140, left=140, right=140)
        p_cell = cell.paragraphs[0]
        r = p_cell.add_run(h_text)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9.5)

    crono_data = [
        ("Fase 1: Semanas 1 y 2\n(Estructuración Legal)", "• Registro Mercantil de KATIANA S.A.S. (CIIU 4772).\n• Contratación de Regente de Farmacia titulado (ReTHUS).\n• Radicación de Uso de Suelo y apertura de expediente en Secretaría de Salud.", "RUT definitivo, Matrícula Mercantil y Contrato de Dirección Técnica."),
        ("Fase 2: Semanas 3 y 4\n(Adecuación de Bodega)", "• Pintura epóxica lavable, estanterías y estibas plásticas a 15 cm.\n• Instalación de nevera de cadena de frío y termohigrómetros.\n• Contratación de empresa recolectora de residuos peligrosos (PGIRHS).", "Bodega lista para inspección y Manuales POE aprobados."),
        ("Fase 3: Semanas 5 y 6\n(Apertura de Cuentas y Stock)", "• Vinculación a Copidrogas / Axon Pharma con crédito a 30 días.\n• Carga del inventario inicial ($25M a $35M COP en referencias ABC).\n• Visita de Secretaría de Salud e Inspección Sanitaria.", "Concepto Sanitario Favorable y stock inicial en bodega."),
        ("Fase 4: Semanas 7 y 8\n(Integración y Go-Live)", "• Activación de cuenta en Rappi Partners Merchant.\n• Conexión de pasarelas de pago y WhatsApp Business API.\n• Lanzamiento de campañas de Google Ads y Meta Ads.", "Inicio de operaciones express en vivo y primeros 100 pedidos.")
    ]

    for row_idx, data_row in enumerate(crono_data, start=1):
        row = table_crono.rows[row_idx]
        for col_idx, text_val in enumerate(data_row):
            c = row.cells[col_idx]
            set_cell_background(c, HEX_LIGHT_BG if row_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(c, top=100, bottom=100, left=120, right=120)
            p_c = c.paragraphs[0]
            r = p_c.add_run(text_val)
            if col_idx == 0:
                r.bold = True
            r.font.size = Pt(8.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(20)

    # Conclusión Final
    p_fin = doc.add_paragraph()
    r_fin = p_fin.add_run("CONCLUSIÓN:\n")
    r_fin.bold = True
    r_fin.font.color.rgb = COLOR_PRIMARY_DARK
    p_fin.add_run(
        "El modelo de Dark Pharmacy para KATIANA ofrece una ventaja competitiva radical frente a las droguerías tradicionales: costos fijos hasta un 65% inferiores, velocidad de entrega inigualable (menos de 45 minutos), alta rentabilidad gracias al capital de trabajo negativo de los proveedores y un motor de retención automatizado por canales digitales. Siguiendo este manual legal, la operación será 100% legítima, protegida ante el INVIMA y altamente rentable desde el primer trimestre."
    )

    # Guardar en Desktop y en la carpeta del proyecto
    path_desktop = r"C:\Users\dan\Desktop\KATIANA_Plan_Maestro_Legal_Logistica_Finanzas.docx"
    path_project = r"C:\Users\dan\Desktop\katiana-web\docs\KATIANA_Plan_Maestro_Legal_Logistica_Finanzas.docx"

    doc.save(path_desktop)
    doc.save(path_project)
    print(f"Documento guardado exitosamente en:\n1. {path_desktop}\n2. {path_project}")

if __name__ == "__main__":
    create_document()
