import{x as R,u as H,j as e,R as se,T as ae,U as T,W as te,X as ne,Y as ce}from"./index-DR2U_o5h.js";import{r as i}from"./ui-DelVeFz9.js";import{p as $,n as D,q as re,I as oe,U as ie,t as le,H as de}from"./firebase-6pRa6zot.js";import"./vendor-1zw1pNgy.js";const p={VEHICLES:"combustibles_vehicles",MOVEMENTS:"combustibles_movements",PRODUCTS:"combustibles_products",INVENTORY:"combustibles_inventory",SUPPLIERS:"combustibles_suppliers",MAINTENANCE:"combustibles_maintenance",VEHICLE_CATEGORIES:"combustibles_vehicle_categories",PRODUCT_CATEGORIES:"productCategories",MIGRATION_ALIASES:"combustibles_migration_aliases",MIGRATION_LOGS:"migration_logs"},me=[p.MOVEMENTS,p.MAINTENANCE,p.INVENTORY,p.VEHICLES,p.PRODUCTS,p.SUPPLIERS,p.VEHICLE_CATEGORIES,p.PRODUCT_CATEGORIES,p.MIGRATION_ALIASES,p.MIGRATION_LOGS],ue=async()=>{try{const t={};for(const[s,a]of Object.entries(p))try{const r=await $(D(R,a));t[s]={name:a,displayName:w(s),count:r.size,icon:V(s)}}catch(r){console.error(`Error getting stats for ${a}:`,r),t[s]={name:a,displayName:w(s),count:0,icon:V(s),error:r.message}}return t}catch(t){throw console.error("Error getting data statistics:",t),new Error("Error al obtener estadísticas de datos: "+t.message)}},q=async(t,s=null)=>{try{console.log(`🗑️ Eliminando colección: ${t}`);let a=0,r=!0;for(;r;){const o=await $(re(D(R,t),oe(100)));if(o.empty){r=!1;break}const l=ie(R);o.docs.forEach(j=>{l.delete(j.ref)}),await l.commit(),a+=o.size,s&&s(t,a),console.log(`✅ Eliminados ${a} documentos de ${t}`),o.size<100&&(r=!1)}return{success:!0,deletedCount:a,collection:t}}catch(a){throw console.error(`Error deleting collection ${t}:`,a),new Error(`Error al eliminar colección ${t}: ${a.message}`)}},he=async(t,s=null)=>{try{const a=[];for(const r of t)try{const o=await q(r,s);a.push(o)}catch(o){a.push({success:!1,error:o.message,collection:r})}return a}catch(a){throw console.error("Error deleting specific collections:",a),new Error("Error al eliminar colecciones específicas: "+a.message)}},xe=async(t=null)=>{try{console.log("🔥 Iniciando reset completo de datos...");const s=[];for(const a of me)try{t&&t(`Eliminando ${w(F(a))}...`);const r=await q(a,(o,l)=>{t&&t(`${w(F(o))}: ${l} elementos eliminados`)});s.push(r)}catch(r){console.error(`Error resetting ${a}:`,r),s.push({success:!1,error:r.message,collection:a})}return await ge(s),t&&t("✅ Reset completo terminado"),console.log("✅ Reset completo terminado"),s}catch(s){throw console.error("Error during complete reset:",s),new Error("Error durante el reset completo: "+s.message)}},pe=async(t=null)=>{try{console.log("💾 Creando backup de datos...");const s={timestamp:new Date().toISOString(),collections:{}},a=t||Object.values(p);for(const o of a)try{const l=await $(D(R,o));s.collections[o]=l.docs.map(j=>({id:j.id,data:j.data()})),console.log(`📦 Backup creado para ${o}: ${l.size} documentos`)}catch(l){console.error(`Error creating backup for ${o}:`,l),s.collections[o]={error:l.message,count:0}}const r=`combustibles_backup_${Date.now()}`;return localStorage.setItem(r,JSON.stringify(s)),console.log("✅ Backup creado exitosamente"),{success:!0,backupKey:r,backup:s}}catch(s){throw console.error("Error creating backup:",s),new Error("Error al crear backup: "+s.message)}},ge=async t=>{try{const s={action:"COMPLETE_DATA_RESET",timestamp:le(),results:t,totalCollections:t.length,successfulResets:t.filter(a=>a.success).length,failedResets:t.filter(a=>!a.success).length,totalDocumentsDeleted:t.reduce((a,r)=>a+(r.deletedCount||0),0)};await de(D(R,"system_logs"),s),console.log("📝 Reset action logged")}catch(s){console.error("Error logging reset action:",s)}},w=t=>({VEHICLES:"Vehículos",MOVEMENTS:"Movimientos",PRODUCTS:"Productos",INVENTORY:"Inventario",SUPPLIERS:"Proveedores",MAINTENANCE:"Mantenimiento",VEHICLE_CATEGORIES:"Categorías de Vehículos",PRODUCT_CATEGORIES:"Categorías de Productos",MIGRATION_ALIASES:"Alias de Migración",MIGRATION_LOGS:"Logs de Migración"})[t]||t,V=t=>({VEHICLES:"🚜",MOVEMENTS:"📈",PRODUCTS:"🛢️",INVENTORY:"📦",SUPPLIERS:"🏪",MAINTENANCE:"🔧",VEHICLE_CATEGORIES:"🏷️",PRODUCT_CATEGORIES:"🏷️",MIGRATION_ALIASES:"🔄",MIGRATION_LOGS:"📋"})[t]||"📄",F=t=>{for(const[s,a]of Object.entries(p))if(a===t)return s;return t},je=t=>t?.role==="admin",be=()=>{const t=[];for(let s=0;s<localStorage.length;s++){const a=localStorage.key(s);if(a&&a.startsWith("combustibles_backup_"))try{const r=JSON.parse(localStorage.getItem(a));t.push({key:a,timestamp:r.timestamp,collections:Object.keys(r.collections||{}).length})}catch(r){console.error(`Error parsing backup ${a}:`,r)}}return t.sort((s,a)=>new Date(a.timestamp)-new Date(s.timestamp))},Ne=()=>{const{userProfile:t}=H(),[s,a]=i.useState({}),[r,o]=i.useState(!0),[l,j]=i.useState(!1),[v,g]=i.useState(""),[u,b]=i.useState([]),[C,x]=i.useState(!1),[h,f]=i.useState(0),[y,k]=i.useState(""),[E,O]=i.useState(""),[I,c]=i.useState(!0),[m,Y]=i.useState([]),[P,z]=i.useState(!1),L=je(t);i.useEffect(()=>{L&&(G(),M())},[L]);const G=async()=>{try{o(!0);const n=await ue();a(n)}catch(n){console.error("Error loading stats:",n)}finally{o(!1)}},M=()=>{const n=be();Y(n)},J=n=>{b(d=>d.includes(n)?d.filter(_=>_!==n):[...d,n])},W=()=>{const n=Object.keys(s).filter(d=>s[d].count>0);b(d=>d.length===n.length?[]:n)},B=n=>{if(n==="selected"&&u.length===0){alert("Selecciona al menos una colección para eliminar");return}O(n),x(!0),f(0),k("")},K=()=>{if(h===0)f(1);else if(h===1){const n=E==="complete"?"RESET COMPLETO":"ELIMINAR SELECCIONADOS";y===n?f(2):alert(`Debes escribir exactamente: ${n}`)}else h===2&&X()},X=async()=>{try{if(j(!0),x(!1),g("Iniciando proceso de eliminación..."),I){g("Creando backup de seguridad...");const N=E==="complete"?null:u.map(S=>s[S].name);await pe(N),g("Backup creado exitosamente")}let n;if(E==="complete")n=await xe(N=>{g(N)});else{const N=u.map(S=>s[S].name);n=await he(N,(S,ee)=>{g(`${S}: ${ee} elementos eliminados`)})}const d=n.filter(N=>N.success).length,_=n.filter(N=>!N.success).length,Z=n.reduce((N,S)=>N+(S.deletedCount||0),0);g(`✅ Proceso completado: ${d} exitosos, ${_} fallidos. Total eliminados: ${Z}`),setTimeout(()=>{G(),M(),b([]),g("")},3e3)}catch(n){console.error("Error during reset:",n),g(`❌ Error: ${n.message}`)}finally{j(!1)}},Q=()=>{x(!1),f(0),k(""),O("")},A=()=>Object.values(s).reduce((n,d)=>n+(d.count||0),0),U=()=>u.reduce((n,d)=>n+(s[d]?.count||0),0);return L?r?e.jsx("div",{className:"data-reset",children:e.jsxs("div",{className:"loading",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"Cargando estadísticas de datos..."})]})}):e.jsxs("div",{className:"data-reset",children:[e.jsxs("div",{className:"reset-header",children:[e.jsx("h2",{children:"🔥 Reset de Datos"}),e.jsxs("p",{children:["Administra y elimina datos de la aplicación. ",e.jsx("strong",{children:"¡Usa con precaución!"})]})]}),(l||v)&&e.jsx("div",{className:"progress-section",children:e.jsxs("div",{className:"progress-bar",children:[l&&e.jsx("div",{className:"progress-spinner"}),e.jsx("span",{children:v})]})}),e.jsxs("div",{className:"stats-summary",children:[e.jsxs("div",{className:"summary-card",children:[e.jsx("h3",{children:"📊 Resumen de Datos"}),e.jsxs("div",{className:"summary-stats",children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-number",children:Object.keys(s).length}),e.jsx("span",{className:"stat-label",children:"Colecciones"})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-number",children:A()}),e.jsx("span",{className:"stat-label",children:"Documentos Totales"})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-number",children:u.length}),e.jsx("span",{className:"stat-label",children:"Seleccionadas"})]})]})]}),e.jsxs("div",{className:"summary-card",children:[e.jsx("h3",{children:"💾 Opciones de Backup"}),e.jsxs("div",{className:"backup-options",children:[e.jsxs("label",{className:"backup-toggle",children:[e.jsx("input",{type:"checkbox",checked:I,onChange:n=>c(n.target.checked)}),e.jsx("span",{children:"Crear backup antes del reset"})]}),e.jsxs("button",{className:"btn-secondary",onClick:()=>z(!P),children:["📋 Ver Backups (",m.length,")"]})]})]})]}),P&&e.jsxs("div",{className:"backups-section",children:[e.jsx("h3",{children:"💾 Backups Disponibles"}),m.length===0?e.jsx("p",{children:"No hay backups disponibles"}):e.jsx("div",{className:"backups-list",children:m.map(n=>e.jsxs("div",{className:"backup-item",children:[e.jsxs("div",{className:"backup-info",children:[e.jsx("span",{className:"backup-date",children:new Date(n.timestamp).toLocaleString()}),e.jsxs("span",{className:"backup-collections",children:[n.collections," colecciones"]})]}),e.jsx("button",{className:"btn-danger btn-small",onClick:()=>{window.confirm("¿Eliminar este backup?")&&(localStorage.removeItem(n.key),M())},children:"🗑️"})]},n.key))})]}),e.jsxs("div",{className:"collections-section",children:[e.jsxs("div",{className:"collections-header",children:[e.jsx("h3",{children:"📋 Colecciones de Datos"}),e.jsx("div",{className:"collection-actions",children:e.jsx("button",{className:"btn-secondary",onClick:W,disabled:l,children:u.length===Object.keys(s).filter(n=>s[n].count>0).length?"Deseleccionar Todo":"Seleccionar Todo"})})]}),e.jsx("div",{className:"collections-grid",children:Object.entries(s).map(([n,d])=>e.jsxs("div",{className:`collection-card ${u.includes(n)?"selected":""}`,children:[e.jsxs("div",{className:"collection-header",children:[e.jsx("div",{className:"collection-icon",children:d.icon}),e.jsxs("div",{className:"collection-info",children:[e.jsx("h4",{children:d.displayName}),e.jsx("p",{className:"collection-name",children:d.name})]}),e.jsx("label",{className:"collection-checkbox",children:e.jsx("input",{type:"checkbox",checked:u.includes(n),onChange:()=>J(n),disabled:l||d.count===0})})]}),e.jsxs("div",{className:"collection-stats",children:[e.jsxs("div",{className:"stat-item",children:[e.jsx("span",{className:"stat-number",children:d.count}),e.jsx("span",{className:"stat-label",children:"Documentos"})]}),d.error&&e.jsxs("div",{className:"stat-error",children:["⚠️ ",d.error]})]})]},n))})]}),e.jsxs("div",{className:"reset-actions",children:[e.jsxs("button",{className:"btn-warning",onClick:()=>B("selected"),disabled:l||u.length===0,children:["🗑️ Eliminar Seleccionadas (",U()," docs)"]}),e.jsxs("button",{className:"btn-danger",onClick:()=>B("complete"),disabled:l||A()===0,children:["🔥 Reset Completo (",A()," docs)"]})]}),C&&e.jsx("div",{className:"confirmation-modal",children:e.jsxs("div",{className:"modal-content",children:[e.jsx("div",{className:"modal-header",children:e.jsxs("h3",{children:[h===0&&"⚠️ Confirmación Requerida",h===1&&"✍️ Confirmación por Texto",h===2&&"🔥 Confirmación Final"]})}),e.jsxs("div",{className:"modal-body",children:[h===0&&e.jsxs("div",{className:"confirmation-step",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"ADVERTENCIA:"})," Esta acción ",E==="complete"?"eliminará TODOS los datos":"eliminará las colecciones seleccionadas"," de la aplicación."]}),e.jsxs("ul",{children:[E==="complete"?e.jsxs("li",{children:["Se eliminarán ",A()," documentos de todas las colecciones"]}):e.jsxs(e.Fragment,{children:[e.jsxs("li",{children:["Se eliminarán ",U()," documentos"]}),e.jsxs("li",{children:["Colecciones afectadas: ",u.map(n=>s[n].displayName).join(", ")]})]}),e.jsx("li",{children:"Esta acción NO se puede deshacer"}),I&&e.jsx("li",{children:"Se creará un backup antes de proceder"})]})]}),h===1&&e.jsxs("div",{className:"confirmation-step",children:[e.jsx("p",{children:"Para continuar, escribe exactamente el siguiente texto:"}),e.jsx("div",{className:"confirmation-text-required",children:E==="complete"?"RESET COMPLETO":"ELIMINAR SELECCIONADOS"}),e.jsx("input",{type:"text",value:y,onChange:n=>k(n.target.value),placeholder:"Escribe el texto aquí",className:"confirmation-input"})]}),h===2&&e.jsxs("div",{className:"confirmation-step",children:[e.jsxs("p",{className:"final-warning",children:[e.jsx("strong",{children:"ÚLTIMA CONFIRMACIÓN:"})," ¿Estás completamente seguro de que quieres proceder?"]}),e.jsx("p",{children:"Esta es tu última oportunidad para cancelar."})]})]}),e.jsxs("div",{className:"modal-actions",children:[e.jsx("button",{className:"btn-secondary",onClick:Q,children:"Cancelar"}),e.jsx("button",{className:"btn-danger",onClick:K,disabled:h===1&&!y,children:h===2?"Proceder con Eliminación":"Continuar"})]})]})})]}):e.jsx("div",{className:"data-reset",children:e.jsxs("div",{className:"permission-denied",children:[e.jsx("h2",{children:"🚫 Acceso Denegado"}),e.jsx("p",{children:"Solo los administradores pueden acceder a la función de reset de datos."})]})})},fe=()=>{const[t,s]=i.useState(""),[a,r]=i.useState(!1),[o,l]=i.useState({type:"",text:""}),[j,v]=i.useState(!0);i.useEffect(()=>{g()},[]);const g=async()=>{try{const b=await se();s(b)}catch{l({type:"error",text:"Error cargando imagen actual"})}finally{v(!1)}},u=async b=>{const C=b.target.files[0];if(C){r(!0),l({type:"",text:""});try{const x=await ae(C);x.success?(l({type:"success",text:"✅ Imagen subida exitosamente"}),s(x.url)):l({type:"error",text:x.error})}catch{l({type:"error",text:"Error subiendo imagen"})}finally{r(!1),b.target.value=""}}};return j?e.jsxs("div",{className:"background-manager",children:[e.jsx("h3",{children:"🖼️ Imagen de Fondo del Login"}),e.jsx("div",{className:"loading",children:"Cargando..."})]}):e.jsxs("div",{className:"background-manager",children:[e.jsx("h3",{children:"🖼️ Imagen de Fondo del Login"}),e.jsxs("div",{className:"current-image-section",children:[e.jsx("h4",{children:"Imagen Actual:"}),e.jsx("div",{className:"image-preview",children:t?e.jsx("img",{src:t,alt:"Imagen de fondo actual",style:{width:"100%",height:"200px",objectFit:"cover",borderRadius:"8px",border:"2px solid #e5e7eb"}}):e.jsx("div",{className:"no-image",children:"Sin imagen configurada"})})]}),e.jsxs("div",{className:"upload-section",children:[e.jsx("h4",{children:"Subir Nueva Imagen:"}),e.jsxs("div",{className:"upload-form",children:[e.jsx("input",{type:"file",accept:"image/*",onChange:u,disabled:a,id:"background-upload",style:{display:"none"}}),e.jsx("label",{htmlFor:"background-upload",className:`upload-button ${a?"disabled":""}`,children:a?"📤 Subiendo...":"📁 Seleccionar Nueva Imagen"})]}),e.jsx("div",{className:"upload-info",children:e.jsxs("small",{children:["• Formato: JPG, PNG, WebP",e.jsx("br",{}),"• Tamaño máximo: 5MB",e.jsx("br",{}),"• Resolución recomendada: 1920x1080 o superior"]})})]}),o.text&&e.jsx("div",{className:`message ${o.type}`,children:o.text}),e.jsxs("div",{className:"instructions",children:[e.jsx("h4",{children:"📋 Instrucciones:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"La imagen se mostrará como fondo en la pantalla de login"}),e.jsx("li",{children:"Se aplicará un overlay semitransparente automáticamente"}),e.jsx("li",{children:"Para mejor calidad, usa imágenes de alta resolución"}),e.jsx("li",{children:"Los cambios se aplican inmediatamente"})]})]}),e.jsx("style",{jsx:!0,children:`
        .background-manager {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .background-manager h3 {
          margin-top: 0;
          color: #2d5016;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
        }

        .background-manager h4 {
          color: #1b4332;
          margin: 20px 0 10px 0;
        }

        .current-image-section {
          margin-bottom: 30px;
        }

        .image-preview {
          margin-top: 10px;
        }

        .no-image {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
        }

        .upload-section {
          margin-bottom: 30px;
        }

        .upload-button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #2d5016, #1b4332);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          text-decoration: none;
        }

        .upload-button:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
        }

        .upload-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-info {
          margin-top: 15px;
          padding: 12px;
          background: #f0f9f4;
          border-radius: 6px;
          border-left: 4px solid #16a34a;
        }

        .upload-info small {
          color: #166534;
          line-height: 1.5;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin: 15px 0;
          font-weight: 500;
        }

        .message.success {
          background: #f0f9f4;
          color: #166534;
          border-left: 4px solid #16a34a;
        }

        .message.error {
          background: #fef2f2;
          color: #dc2626;
          border-left: 4px solid #dc2626;
        }

        .instructions {
          background: #fafafa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .instructions ul {
          margin: 10px 0 0 0;
          padding-left: 20px;
        }

        .instructions li {
          margin-bottom: 8px;
          color: #374151;
          line-height: 1.5;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }
      `})]})},Ie=()=>{const{user:t,userProfile:s}=H(),[a,r]=i.useState("invitations"),[o,l]=i.useState([]),[j,v]=i.useState(!1),[g,u]=i.useState(!1),[b,C]=i.useState(!1),[x,h]=i.useState({email:"",name:"",role:T.CLIENTE});i.useEffect(()=>{t&&s?.role==="admin"&&f()},[t,s]);const f=i.useCallback(async()=>{if(t){v(!0);try{const c=await te(t.uid);c.success?l(c.invitations):console.error("Error loading invitations:",c.error)}catch(c){console.error("Error loading invitations:",c)}finally{v(!1)}}},[t]),y=async c=>{c.preventDefault(),C(!0);try{const m=await ce(x,t.uid);m.success?(h({email:"",name:"",role:T.CLIENTE}),u(!1),await f(),alert(`Invitación creada exitosamente!
Código: ${m.invitation.code}`)):alert(`Error: ${m.error}`)}catch(m){console.error("Error creating invitation:",m),alert("Error creando invitación")}finally{C(!1)}},k=async c=>{if(confirm("¿Estás seguro de cancelar esta invitación?"))try{const m=await ne(c,t.uid);m.success?(await f(),alert("Invitación cancelada exitosamente")):alert(`Error: ${m.error}`)}catch(m){console.error("Error cancelling invitation:",m),alert("Error cancelando invitación")}},E=c=>({pending:{text:"Pendiente",class:"status-pending"},used:{text:"Usada",class:"status-used"},cancelled:{text:"Cancelada",class:"status-cancelled"},expired:{text:"Expirada",class:"status-expired"}})[c]||{text:c,class:"status-unknown"},O=c=>({admin:"Administrador",contador:"Contador",cliente:"Cliente"})[c]||c,I=c=>c?(c.toDate?c.toDate():new Date(c)).toLocaleDateString("es-ES",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"N/A";return s?.role!=="admin"?e.jsxs("div",{className:"admin-unauthorized",children:[e.jsx("h2",{children:"⛔ Acceso Denegado"}),e.jsx("p",{children:"Solo los administradores pueden acceder a esta sección."})]}):e.jsxs("div",{className:"admin-main",children:[e.jsxs("div",{className:"admin-header",children:[e.jsx("h1",{children:"⚙️ Administración del Sistema"}),e.jsx("p",{children:"Gestión de usuarios y configuraciones"})]}),e.jsxs("div",{className:"admin-tabs",children:[e.jsx("button",{className:`tab-button ${a==="invitations"?"active":""}`,onClick:()=>r("invitations"),children:"🎫 Invitaciones"}),e.jsx("button",{className:`tab-button ${a==="users"?"active":""}`,onClick:()=>r("users"),children:"👥 Usuarios"}),e.jsx("button",{className:`tab-button ${a==="settings"?"active":""}`,onClick:()=>r("settings"),children:"⚙️ Configuración"}),e.jsx("button",{className:`tab-button ${a==="background"?"active":""}`,onClick:()=>r("background"),children:"🖼️ Imagen Login"}),e.jsx("button",{className:`tab-button ${a==="reset"?"active":""}`,onClick:()=>r("reset"),children:"🔥 Reset de Datos"})]}),e.jsxs("div",{className:"admin-content",children:[a==="invitations"&&e.jsxs("div",{className:"invitations-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Gestión de Invitaciones"}),e.jsx("button",{className:"create-button",onClick:()=>u(!0),children:"+ Crear Invitación"})]}),j?e.jsx("div",{className:"loading",children:"Cargando invitaciones..."}):e.jsxs("div",{className:"invitations-table",children:[e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Código"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{children:"Rol"}),e.jsx("th",{children:"Estado"}),e.jsx("th",{children:"Creada"}),e.jsx("th",{children:"Expira"}),e.jsx("th",{children:"Acciones"})]})}),e.jsx("tbody",{children:o.map(c=>{const m=E(c.status);return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{className:"invitation-code",children:c.code})}),e.jsx("td",{children:c.targetEmail}),e.jsx("td",{children:c.targetName||"-"}),e.jsx("td",{children:O(c.targetRole)}),e.jsx("td",{children:e.jsx("span",{className:`status-badge ${m.class}`,children:m.text})}),e.jsx("td",{children:I(c.createdAt)}),e.jsx("td",{children:I(c.expiresAt)}),e.jsx("td",{children:c.status==="pending"&&e.jsx("button",{className:"cancel-button",onClick:()=>k(c.id),children:"Cancelar"})})]},c.id)})})]}),o.length===0&&e.jsx("div",{className:"empty-state",children:e.jsx("p",{children:"No hay invitaciones creadas"})})]})]}),a==="users"&&e.jsxs("div",{className:"users-section",children:[e.jsx("h2",{children:"👥 Usuarios del Sistema"}),e.jsxs("div",{className:"coming-soon",children:[e.jsx("span",{children:"🚧 En desarrollo"}),e.jsx("p",{children:"Próximamente: Lista de usuarios registrados, edición de permisos, y estadísticas."})]})]}),a==="settings"&&e.jsxs("div",{className:"settings-section",children:[e.jsx("h2",{children:"⚙️ Configuración del Sistema"}),e.jsxs("div",{className:"coming-soon",children:[e.jsx("span",{children:"🚧 En desarrollo"}),e.jsx("p",{children:"Próximamente: Configuraciones generales, notificaciones, y parámetros del sistema."})]})]}),a==="background"&&e.jsx(fe,{}),a==="reset"&&e.jsx(Ne,{})]}),g&&e.jsx("div",{className:"modal-overlay",onClick:()=>u(!1),children:e.jsxs("div",{className:"modal-content",onClick:c=>c.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Crear Nueva Invitación"}),e.jsx("button",{className:"modal-close",onClick:()=>u(!1),children:"×"})]}),e.jsxs("form",{onSubmit:y,className:"invitation-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"email",children:"Email del usuario:"}),e.jsx("input",{id:"email",type:"email",required:!0,value:x.email,onChange:c=>h({...x,email:c.target.value}),placeholder:"usuario@ejemplo.com"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"name",children:"Nombre (opcional):"}),e.jsx("input",{id:"name",type:"text",value:x.name,onChange:c=>h({...x,name:c.target.value}),placeholder:"Nombre del usuario"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"role",children:"Rol:"}),e.jsxs("select",{id:"role",value:x.role,onChange:c=>h({...x,role:c.target.value}),children:[e.jsx("option",{value:T.CLIENTE,children:"Cliente"}),e.jsx("option",{value:T.CONTADOR,children:"Contador"}),e.jsx("option",{value:T.ADMIN,children:"Administrador"})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{type:"button",className:"cancel-button",onClick:()=>u(!1),children:"Cancelar"}),e.jsx("button",{type:"submit",className:"create-button",disabled:b,children:b?"Creando...":"Crear Invitación"})]})]})]})})]})};export{Ie as default};
