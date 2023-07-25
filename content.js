setInterval(() => {
    var button = document.querySelector('#export-chat');
    if (!button) {
      var nav = document.querySelector('nav');
      if (nav) {
        button = document.createElement('a');
        button.classList.add('flex', 'py-3', 'px-3', 'items-center', 'gap-3', 'rounded-md', 'hover:bg-gray-500/10', 'transition-colors', 'duration-200', 'text-white', 'cursor-pointer', 'text-sm');
        button.id = 'export-chat';
        button.innerHTML = '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 15V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18L4 15M8 11L12 15M12 15L16 11M12 15V3" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Export Chat';
        nav.appendChild(button);
        button.addEventListener('click', function() {
          
          // Get all the img elements on the page
          const imgs = document.getElementsByTagName('img');
          
          // Loop through the imgs and find the one with an alt tag
          let selectedImg = null;
          for (let i = 0; i < imgs.length; i++) {
            if (imgs[i].srcset) {
              selectedImg = imgs[i];
              break;
            }
          }
      
          // Check if an img was found with an alt tag
          if (selectedImg) {
            // Convert the image to base64
            const imgSrc = selectedImg.getAttribute('src');
            fetch(`https://chat.openai.com${imgSrc}`)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function() {
                        const base64data = reader.result;
                        const conversation = document.querySelector('main div div div div');
                        if (!conversation) {
                            alert('Could not find conversation');
                            return;
                        }

                        const html = conversation.innerHTML;
                        const customCode = `
                        <html class="dark" style="color-scheme: dark;">\n<head>\n<title>My Page</title>\n<link rel="stylesheet" type="text/css" href="https://drive.google.com/uc?export=view&id=1VzgLsxHBsBFcSQ6kE4Vb1ByL_Wt_DdEK">\n</head>\n</html>
                        `;
                        const newHtml = customCode + html;
                        // create a new DOM document
                        const doc = new DOMParser().parseFromString(newHtml, 'text/html');

                        // modify the <html> element
                        const htmlEl = doc.documentElement;
                        htmlEl.setAttribute('class', 'dark');
                        htmlEl.style.colorScheme = 'dark';

                        // modify any <img> elements
                        const imgs = doc.getElementsByTagName('img');
                        for (let i = 0; i < imgs.length; i++) {
                            imgs[i].setAttribute('src', base64data);
                            imgs[i].setAttribute('srcset', "");
                        }
                        
                        const blob = new Blob([doc.documentElement.outerHTML], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'conversation.html';
                        document.body.appendChild(link);
                        link.click();
                        
                        setTimeout(() => {
                          URL.revokeObjectURL(url);
                          document.body.removeChild(link);
                        }, 0);
                    }
                });
          } else {
              alert('We were unable to export the chat because we could not find any conversation.');
          }
        });
      }
    }
  }, 1000);
  